from PIL import Image

def analyze_and_fix(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Get the color of the top-left pixel
    bg_color = datas[0]
    print(f"Top-left pixel color: {bg_color}")
    
    newData = []
    # Tolerance for background matching
    tolerance = 40
    
    for item in datas:
        # Check if pixel is close to the background color
        if (abs(item[0] - bg_color[0]) < tolerance and
            abs(item[1] - bg_color[1]) < tolerance and
            abs(item[2] - bg_color[2]) < tolerance):
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

if __name__ == "__main__":
    analyze_and_fix("images/logo_original.png", "images/logo_v3.png")
