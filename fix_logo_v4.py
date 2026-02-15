from PIL import Image

def strict_background_removal(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    width, height = img.size
    
    # Sample corners to find background color
    corners = [
        datas[0],                   # Top-left
        datas[width-1],             # Top-right
        datas[(height-1)*width],    # Bottom-left
        datas[len(datas)-1]         # Bottom-right
    ]
    
    # Simple logic: assume the corners match the background
    # We'll take the top-left as the reference
    bg_ref = corners[0]
    print(f"Detected Background Color: {bg_ref}")
    
    newData = []
    tolerance = 30 # Match within this range
    
    for item in datas:
        # Calculate difference from background reference
        diff = max(abs(item[0] - bg_ref[0]), abs(item[1] - bg_ref[1]), abs(item[2] - bg_ref[2]))
        
        # If pixel is close to the background color OR it is very dark (black artifacts)
        # We perform a dual check to be safe
        is_background = diff < tolerance
        is_dark_artifact = item[0] < 30 and item[1] < 30 and item[2] < 30
        
        if is_background or is_dark_artifact:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved logo_v4 to {output_path}")

if __name__ == "__main__":
    strict_background_removal("images/logo_original.png", "images/logo_v4.png")
