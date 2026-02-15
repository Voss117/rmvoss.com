from PIL import Image

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check for black (or very dark gray) pixels
        # If the pixel is dark enough (R, G, B < 30), make it transparent
        if item[0] < 30 and item[1] < 30 and item[2] < 30:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop to content (remove extra transparent space)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")

if __name__ == "__main__":
    make_transparent("images/logo_original.png", "images/logo_transparent.png")
