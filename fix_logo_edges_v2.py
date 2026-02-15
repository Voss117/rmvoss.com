from PIL import Image, ImageFilter

def cleanup_edges_v2(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Split into channels
    r, g, b, a = img.split()
    
    # Apply MinFilter AGAIN to the alpha channel
    # This erodes another 1 pixel layer off the edges
    eroded_a = a.filter(ImageFilter.MinFilter(3))
    
    # Recombine
    img = Image.merge("RGBA", (r, g, b, eroded_a))
    
    # Crop content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved double-eroded logo to {output_path}")

if __name__ == "__main__":
    # We start from v7 (which already had 1 pass) and do it again
    cleanup_edges_v2("images/logo_v7.png", "images/logo_v8.png")
