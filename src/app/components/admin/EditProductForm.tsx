import { useState } from "react";
import { Plus, Trash2, Upload, Loader2, X, Image as ImageIcon, Tags } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Product, updateProduct, uploadImage, Variant } from "../../lib/api";
import { CATEGORIES, CategoryKey, BRANDS } from "../../lib/catalog";

type Props = { 
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
};

export function EditProductForm({ product, onClose, onUpdated }: Props) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState<CategoryKey>(product.category as CategoryKey || "men");
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  
  const isExistingBrand = BRANDS.some(b => b.name === product.brand);
  const [brand, setBrand] = useState(isExistingBrand ? product.brand : "Other");
  const [customBrand, setCustomBrand] = useState(isExistingBrand ? "" : product.brand);
  
  const [price, setPrice] = useState(String(product.price));
  const [images, setImages] = useState<string[]>(product.images && product.images.length > 0 ? product.images : [product.imageUrl]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkPricing, setBulkPricing] = useState<{ minQty: number; price: number }[]>(product.bulkPricing || []);
  const [variants, setVariants] = useState<Variant[]>(product.variants || []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded to Supabase Storage");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error(`Upload failed: ${err}`);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) { setImages(images.filter((_, i) => i !== index)); }
  function addTier() { setBulkPricing([...bulkPricing, { minQty: 10, price: 0 }]); }
  function updateTier(i: number, patch: Partial<{ minQty: number; price: number }>) { setBulkPricing(bulkPricing.map((t, idx) => (idx === i ? { ...t, ...patch } : t))); }
  function removeTier(i: number) { setBulkPricing(bulkPricing.filter((_, idx) => idx !== i)); }
  function addVariant() { setVariants([...variants, { size: "", color: "", stock: 0 }]); }
  function updateVariant(i: number, patch: Partial<Variant>) { setVariants(variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v))); }
  function removeVariant(i: number) { setVariants(variants.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validImages = images.filter(img => img.trim() !== "");
    if (!name || !price || validImages.length === 0) {
      toast.error("Please fill name, price, and upload at least one image");
      return;
    }
    setSubmitting(true);
    
    const finalBrand = brand === "Other" ? customBrand.trim() : brand;

    try {
      await updateProduct(product.id, {
        name,
        description,
        category,
        subcategory,
        brand: finalBrand,
        price: Number(price),
        imageUrl: validImages[0], 
        images: validImages, 
        bulkPricing: bulkPricing.length > 0 ? bulkPricing : undefined,
        variants,
      });
      
      toast.success("Product updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update product failed", err);
      toast.error(`Update failed: ${err}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="bg-neutral-900 border-white/10 text-white mb-8 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
        <CardTitle className="text-xl text-amber-400">Editing: {product.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></Button>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><Label className="text-neutral-300">Product Name</Label><Input className="bg-neutral-950 border-white/10" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label className="text-neutral-300">Description</Label><Textarea className="bg-neutral-950 border-white/10" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-neutral-300">Category</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v as CategoryKey); setSubcategory(""); }}>
                  <SelectTrigger className="bg-neutral-950 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/10 text-white">
                    <SelectItem value="men">Men</SelectItem><SelectItem value="women">Women</SelectItem><SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="unisex" className="text-amber-400">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-neutral-300">Subcategory</Label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger className="bg-neutral-950 border-white/10"><SelectValue placeholder="Pick..." /></SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/10 text-white">
                    {CATEGORIES[category]?.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-neutral-300">Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="bg-neutral-950 border-white/10"><SelectValue placeholder="Pick..." /></SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/10 text-white">
                    {BRANDS.map((b) => (<SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>))}
                    <SelectItem value="Other" className="text-amber-400 font-bold">Other (Custom)</SelectItem>
                  </SelectContent>
                </Select>
                {brand === "Other" && (
                  <Input placeholder="Type brand name..." value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} className="bg-neutral-950 border-amber-400/50 mt-2 focus:border-amber-400" required />
                )}
              </div>
              <div><Label className="text-amber-400 font-bold">Base Price (LKR)</Label><Input className="bg-neutral-950 border-amber-400/50 focus:border-amber-400" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="For Qty: 1" /></div>
            </div>
            <div className="p-4 border border-white/5 rounded-xl bg-neutral-950/50">
              <div className="flex items-center gap-2 mb-3"><ImageIcon className="w-4 h-4 text-neutral-400" /><Label className="text-neutral-200 text-base">Product Images</Label></div>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 group">
                    <img src={img} alt={`img-${i}`} className="w-full h-full object-cover rounded-lg border border-white/10" />
                    {images.length > 1 && <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X className="w-3 h-3" /></button>}
                  </div>
                ))}
                <label className="w-20 h-20 cursor-pointer border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center hover:bg-white/5 transition">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-neutral-400" /> : <Upload className="w-4 h-4 text-neutral-400" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-4 border border-amber-400/20 rounded-lg bg-amber-400/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Tags className="w-4 h-4 text-amber-400" /><div><Label className="text-amber-400 text-base">Bulk Pricing Tiers</Label><p className="text-xs text-neutral-400">Offer discounts for higher quantities.</p></div></div>
                <Button type="button" size="sm" variant="outline" onClick={addTier} className="border-amber-400/30 text-amber-400 hover:bg-amber-400/20 h-8"><Plus className="w-4 h-4 mr-1" /> Add Tier</Button>
              </div>
              <div className="space-y-2">
                {bulkPricing.map((tier, i) => (
                  <div key={i} className="flex items-end gap-3 p-3 border border-white/10 rounded-lg bg-neutral-950">
                    <div className="flex-1 space-y-1"><Label className="text-xs text-neutral-400">{"If Qty is >="}</Label><Input type="number" value={tier.minQty} onChange={(e) => updateTier(i, { minQty: Number(e.target.value) })} className="bg-neutral-900 border-white/10 h-8 text-sm" /></div>
                    <div className="flex-1 space-y-1"><Label className="text-xs text-neutral-400">Price becomes (LKR)</Label><Input type="number" value={tier.price} onChange={(e) => updateTier(i, { price: Number(e.target.value) })} className="bg-neutral-900 border-white/10 h-8 text-sm text-amber-400" /></div>
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeTier(i)} className="h-8 w-8 hover:text-red-400 mb-0.5"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                {bulkPricing.length === 0 && <p className="text-xs text-neutral-500 italic">No bulk tiers set.</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label className="text-neutral-300">Variants (Size, Color, Stock)</Label><Button type="button" size="sm" variant="outline" onClick={addVariant} className="border-white/10 hover:bg-white/5 h-8"><Plus className="w-4 h-4 mr-1" /> Add variant</Button></div>
              <div className="space-y-2 max-h-[250px] overflow-auto pr-1">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_90px_auto] gap-2 items-end p-3 border border-white/10 rounded-lg bg-neutral-950">
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-400">Size</Label>
                      <Input placeholder="e.g. 32, XL, Free" className="bg-neutral-900 border-white/10 h-8 text-sm text-white" value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-400">Color</Label>
                      <Input placeholder="e.g. Navy, Red, #ff0000" className="bg-neutral-900 border-white/10 h-8 text-sm text-white" value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} />
                    </div>
                    <div className="space-y-1"><Label className="text-xs text-neutral-400">Stock</Label><Input type="number" className="bg-neutral-900 border-white/10 h-8" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} /></div>
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(i)} className="h-8 w-8 hover:text-red-400 mb-0.5"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-amber-400 text-black hover:bg-amber-500 px-8 font-bold">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}