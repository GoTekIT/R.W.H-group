"""Build original desktop assets and separate mobile images from a downloaded Drive cache.
Requires Pillow and PyMuPDF. Assets outside the Drive retain their existing sources.
"""
import pathlib,json,zipfile,hashlib,io,re,subprocess,sys
import pymupdf
from PIL import Image,ImageChops,ImageStat,ImageOps
root=pathlib.Path(__file__).resolve().parent;d=root/'dist';cache=pathlib.Path(sys.argv[1])
manifest=json.loads((root/'PROJECT_SOURCES.json').read_text());landing=json.loads((root/'LANDING_IMAGES.json').read_text());report=[];docs={};archives={}
for p in manifest['projects']:
 for idx,im in enumerate(p['images']):
  src=im['source'];fid=src.get('fileId');kind='retained-existing';data=None
  if fid:
   f=cache/fid
   if (cache/(fid+'.pptx')).exists():f=cache/(fid+'.pptx')
   if 'fileName' in src:data=f.read_bytes();kind='drive-original'
   elif zipfile.is_zipfile(f):
    if fid not in archives:archives[fid]=zipfile.ZipFile(f)
    z=archives[fid];name=next(n for n in z.namelist() if n.endswith('/'+src['embeddedImage']));data=z.read(name);kind='embedded-original'
   else:
    if fid not in docs:docs[fid]=pymupdf.open(f)
    page,num=map(int,re.match(r'page(\d+)-(\d+)',src['embeddedImage']).groups());doc=docs[fid];data=doc.extract_image(doc[page-1].get_images()[num][0])['image'];kind='pdf-embedded-original'
  else:data=(d/(p['hero'] if idx == 0 else im['src'])).read_bytes()
  image=Image.open(io.BytesIO(data));image.load();sha=hashlib.sha256(data).hexdigest()
  if kind in ['drive-original','embedded-original']:assert sha==im['sourceSha256'],(p['slug'],im['name'])
  if kind=='pdf-embedded-original':
   old=Image.open(d/im['src']).convert('RGB').resize((128,128));new=image.convert('RGB').resize((128,128));mae=sum(ImageStat.Stat(ImageChops.difference(old,new)).mean)/3
   assert mae<15,(p['slug'],idx,mae)
  ext={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp'}[image.format]
  target=f"assets/rwh-projects/{p['slug']}/original-{idx+1:02d}-{sha[:10]}{ext}"
  (d/target).write_bytes(data);im['originalSrc']=target;im['originalWidth'],im['originalHeight']=image.size
  mobile=f"assets/rwh-projects/{p['slug']}/mobile-hq-{idx+1:02d}-{sha[:10]}.webp"
  image=ImageOps.exif_transpose(image).convert('RGB');image.thumbnail((1600,2400));
  if not (d/mobile).exists(): image.save(d/mobile,'WEBP',quality=95,method=4)
  im['mobileSrc']=mobile
  report.append({'project':p['slug'],'image':idx+1,'kind':kind,'sha256':sha,'path':target,'bytes':len(data)})
  print(p['slug'],idx+1,kind,flush=True)
 # Keep client-selected hero photographs; otherwise use original first gallery photo.
 pc=p.get('landingHero',p['images'][0]['originalSrc'])
 if p['slug']=='capital-one':pc=p['images'][1]['originalSrc']
 landing[p['slug']]['pc']=pc
 mobile=f"assets/rwh-projects/{p['slug']}/landing-mobile-hq.webp"
 image=ImageOps.exif_transpose(Image.open(d/(p.get('landingHero') or p['images'][0]['originalSrc']))).convert('RGB');image.thumbnail((1600,2400));image.save(d/mobile,'WEBP',quality=95,method=4)
 landing[p['slug']]['sp']=mobile
(root/'PROJECT_SOURCES.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(root/'LANDING_IMAGES.json').write_text(json.dumps(landing,ensure_ascii=False,indent=2)+'\n')
(root/'ORIGINAL_MEDIA_AUDIT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
