from PIL import Image, ImageFilter

def super_smooth(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Supersample: Resize to 4x original size using high-quality resampling
    # This creates interpolated pixels to work with, effectively vectorizing the raster
    width, height = img.size
    new_width, new_height = width * 4, height * 4
    high_res = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # 2. Extract Alpha Channel which contains the "shape"
    r, g, b, a = high_res.split()
    
    # 3. Blur the Alpha channel
    # This "melts" the jagged/pixelated edges together into a smooth gradient
    # A radius of 3 on a 4x image is comparable to 0.75px blur on original
    masked_blur = a.filter(ImageFilter.GaussianBlur(radius=3))
    
    # 4. Sharpen Alpha (Limit Curve)
    # This takes the blurred gradient and tightens it back up, but smoothly.
    # It turns the blurry "glow" into a sharp, crisp line with perfect anti-aliasing.
    def contrast_curve(p):
        # Push gray values to black or white, but keep a small ramp for smoothness
        if p < 80: return 0
        if p > 175: return 255
        return int((p - 80) * (255 / 95))
        
    sharp_a = masked_blur.point(contrast_curve)
    
    # 5. Merge back
    high_res = Image.merge("RGBA", (r, g, b, sharp_a))
    
    # 6. Downsample back to original size
    # This effectively "bakes" the new smooth edges into high-quality pixels
    final_img = high_res.resize((width, height), Image.Resampling.LANCZOS)
    
    # 7. Final Polish: Mild Unsharp Mask to make it pop
    final_img = final_img.filter(ImageFilter.UnsharpMask(radius=0.5, percent=100, threshold=0))

    final_img.save(output_path, "PNG")
    print(f"Saved super-smoothed logo to {output_path}")

if __name__ == "__main__":
    super_smooth("images/logo_v10.png", "images/logo_v11.png")
