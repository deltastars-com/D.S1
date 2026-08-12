from PIL import Image
import os

src = '/home/ubuntu/upload/icon-512.png'
pub_dir = '/home/ubuntu/delta-stars-v2/client/public'
os.makedirs(pub_dir, exist_ok=True)

im = Image.open(src).convert('RGBA')
im.save(os.path.join(pub_dir, 'official_logo.png'))
im.save(os.path.join(pub_dir, 'favicon.png'))
im.save(os.path.join(pub_dir, 'apple-touch-icon.png'))

res_dir = '/home/ubuntu/delta-stars-v2/android/app/src/main/res'
mipmap_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

for folder, sz in mipmap_sizes.items():
    d = os.path.join(res_dir, folder)
    os.makedirs(d, exist_ok=True)
    resized = im.resize((sz, sz), Image.Resampling.LANCZOS)
    resized.save(os.path.join(d, 'ic_launcher.png'))
    resized.save(os.path.join(d, 'ic_launcher_round.png'))
    resized.save(os.path.join(d, 'ic_launcher_foreground.png'))

print('Successfully applied exact original icon!')
