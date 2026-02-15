from PIL import Image

def remove_high_red_artifacts(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # Analysis:
    # Logo Colors: Cyan (#38bdf8 -> R=56) to Emerald (#10b981 -> R=16)
    # White/Gray Artifacts: (R>100, G>100, B>100)
    # Strategy: Kill any pixel with Red > 100. 
    # This preserves the logo (R~20-60) but removes white halos (R~200+).
    
    red_limit = 100
    
    for item in datas:
        r, g, b, a = item
        
        # If Red is high, it's NOT our logo. It's white/gray noise.
        # We also check if alpha > 0 to avoid processing already transparent pixels
        if a > 0 and r > red_limit:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved red-channel-cleaned logo to {output_path}")

if __name__ == "__main__":
    remove_high_red_artifacts("images/logo_v9.png", "images/logo_v10.png")
