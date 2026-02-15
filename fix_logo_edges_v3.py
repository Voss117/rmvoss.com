from PIL import Image, ImageFilter

def cleanup_edges_v3(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Split
    r, g, b, a = img.split()
    
    # Apply MinFilter AGAIN (Round 3)
    # This removes the 3rd pixel layer from the edge
    eroded_a = a.filter(ImageFilter.MinFilter(3))
    
    # Recombine
    img = Image.merge("RGBA", (r, g, b, eroded_a))
    
    # OPTIONAL: Smooth the edges slightly to remove "jaggies" from erosion
    # This blurs the alpha channel just a tiny bit
    # smooth_a = eroded_a.filter(ImageFilter.GaussianBlur(0.5))
    # img.putalpha(smooth_a)
    
    # Crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved triple-eroded logo to {output_path}")

if __name__ == "__main__":
    cleanup_edges_v3("images/logo_v8.png", "images/logo_v9.png")
