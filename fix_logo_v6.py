from PIL import Image

def saturation_filter_removal(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # If the pixel has low saturation (i.e. it is gray, black, or white), remove it.
    # The logo is vibrant Cyan/Green, so it has high saturation.
    saturation_threshold = 40 
    
    for item in datas:
        r, g, b, a = item
        
        # Calculate chroma (difference between max and min channel)
        # Low chroma = grayscale (background/checkerboard)
        # High chroma = color (logo)
        chroma = max(r, g, b) - min(r, g, b)
        
        if chroma < saturation_threshold:
            # It's a gray/black/white pixel -> Transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved saturation-filtered logo to {output_path}")

if __name__ == "__main__":
    saturation_filter_removal("images/logo_original.png", "images/logo_v6.png")
