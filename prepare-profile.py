"""Create a lighter web PDF while preserving pages, searchable text and layout."""
from collections import Counter
from io import BytesIO
from math import hypot
from pathlib import Path
import argparse
import zlib

from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, ByteStringObject, DecodedStreamObject, NameObject, NumberObject


def object_key(reference):
    return (reference.idnum, reference.generation)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--dpi', type=int, default=110)
    parser.add_argument('--quality', type=int, default=45)
    args = parser.parse_args()
    reader = PdfReader(args.source)
    original_text = [page.extract_text() or '' for page in reader.pages]
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    placements = {}
    for page in writer.pages:
        resources = page.get('/Resources', {}).get('/XObject', {})
        def visit(operation, operands, matrix, text_matrix):
            if operation != b'Do' or not operands or operands[0] not in resources:
                return
            reference = resources.raw_get(operands[0])
            if not hasattr(reference, 'idnum') or reference.get_object().get('/Subtype') != '/Image':
                return
            width, height = hypot(matrix[0], matrix[1]), hypot(matrix[2], matrix[3])
            placements[object_key(reference)] = max(placements.get(object_key(reference), 0), width, height)
        page.extract_text(visitor_operand_before=visit)

    seen = set()
    stats = Counter()
    for page in writer.pages:
        for item in page.images:
            reference = item.indirect_reference
            if reference is None or object_key(reference) in seen:
                continue
            key = object_key(reference)
            seen.add(key)
            image = item.image.copy()
            if max(image.size) <= 420:
                stats['small_images_kept'] += 1
                continue
            rgba = image.convert('RGBA')
            white = Image.new('RGBA', rgba.size, 'white')
            white.alpha_composite(rgba)
            entropy = white.convert('L').resize((96, 96)).entropy()
            graphic = entropy < 4.7
            dpi = max(args.dpi, 150) if graphic else args.dpi
            longest = max(420 if graphic else 240, round(placements.get(key, 576) * dpi / 72))
            image.thumbnail((longest, longest), Image.Resampling.LANCZOS)
            rgb = image.convert('RGB')
            stream = reference.get_object()
            for entry in ['/DecodeParms', '/Decode', '/SMask', '/Mask', '/SMaskInData']:
                stream.pop(NameObject(entry), None)
            stream[NameObject('/Width')] = NumberObject(image.width)
            stream[NameObject('/Height')] = NumberObject(image.height)
            stream[NameObject('/BitsPerComponent')] = NumberObject(8)
            if graphic:
                indexed = rgb.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
                stream._data = zlib.compress(indexed.tobytes(), 9)
                stream[NameObject('/Filter')] = NameObject('/FlateDecode')
                palette = bytes(indexed.getpalette()[:384])
                stream[NameObject('/ColorSpace')] = ArrayObject([NameObject('/Indexed'), NameObject('/DeviceRGB'), NumberObject(127), ByteStringObject(palette)])
                stats['graphics_optimized'] += 1
            else:
                jpeg = BytesIO()
                rgb.save(jpeg, format='JPEG', quality=args.quality, optimize=True, progressive=False)
                stream._data = jpeg.getvalue()
                stream[NameObject('/Filter')] = NameObject('/DCTDecode')
                stream[NameObject('/ColorSpace')] = NameObject('/DeviceRGB')
                stats['photos_optimized'] += 1
            if image.mode == 'RGBA' and image.getchannel('A').getextrema() != (255, 255):
                mask = DecodedStreamObject()
                mask.set_data(image.getchannel('A').tobytes())
                mask.update({NameObject('/Type'): NameObject('/XObject'), NameObject('/Subtype'): NameObject('/Image'), NameObject('/Width'): NumberObject(image.width), NameObject('/Height'): NumberObject(image.height), NameObject('/ColorSpace'): NameObject('/DeviceGray'), NameObject('/BitsPerComponent'): NumberObject(8)})
                stream[NameObject('/SMask')] = writer._add_object(mask.flate_encode())
            stream.decoded_self = None
        page.compress_content_streams()
    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(args.output)
    result = PdfReader(args.output)
    assert len(result.pages) == len(reader.pages), 'Page count changed'
    assert [page.extract_text() or '' for page in result.pages] == original_text, 'Searchable text changed'
    assert [list(page.mediabox) for page in result.pages] == [list(page.mediabox) for page in reader.pages], 'Page dimensions changed'
    print({'pages': len(result.pages), 'size_mb': round(args.output.stat().st_size / 1024**2, 2), 'stats': dict(stats), 'text_and_layout': 'preserved'})


if __name__ == '__main__':
    main()
