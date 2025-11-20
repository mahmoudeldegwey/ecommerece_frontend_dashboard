import exp from 'constants';
import { z } from 'zod';

export const loginSchema = (t: (key:string) => string) => z.object({
  email: z.string().min(6, { message: t('email_required') }),
  password: z.string().min(6, { message: t('password_required') }),
});

export const RoleSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  permissions: z.array(z.number()).min(1, { message: t('permissions_required') }),
});

export const UserSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  email: z.string().min(6, { message: t('email_required') }),
  password: z.string().min(6, { message: t('password_required') }),
});

export const UserEditSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  email: z.string().min(6, { message: t('email_required') }),
  //password: z.string().min(6, { message: t('password_required') }),
});

export const UserChangePasswordSchema = (t:(key:string) => string ) => z.object({
  password: z.string().min(6, { message: t('password_required') }),
  password_confirmation: z.string().min(6, { message: t('password_confirmation_required') }),
}).refine((data) => data.password === data.password_confirmation, {
  message: t('passwords_must_match')
});

export const BrandSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  name_ar: z.string().nonempty({ message: t('name_ar_required') }),
});

export const CategorySchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  name_ar: z.string().nonempty({ message: t('name_ar_required') }),
});

export const SizeSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  name_ar: z.string().nonempty({ message: t('name_ar_required') }),
});

export const ColorSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  name_ar: z.string().nonempty({ message: t('name_ar_required') }),
});

export const CouponSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  code: z.string().nonempty({ message: t('code_required') }),
  start_at: z.string().nonempty({ message: t('start_at_required') }),
  end_at: z.string().nonempty({ message: t('end_at_required') }),
  type: z.enum(['fixed', 'percentage'], { required_error: t('type_required') }),
  amount: z.number().min(0, { message: t('amount_required') }),
  // usage: z.number().min(0, { message: t('usage_required') }),
});

export const ClientSchema = (t:(key:string) => string ) => z.object({ 
  username: z.string().nonempty({ message: t('username_required') }),
  email: z.string().min(6, { message: t('email_required') }),
  password: z.string().min(6, { message: t('password_required') }),
  password_confirmation: z.string().min(6, { message: t('password_confirmation_required') }),
}).refine((data) => data.password === data.password_confirmation, {
  message: t('passwords_must_match')
});


export const ClientEditSchema = (t:(key:string) => string ) => z.object({
  username: z.string().nonempty({ message: t('username_required') }),
  email: z.string().min(6, { message: t('email_required') }),
  //password: z.string().min(6, { message: t('password_required') }),
});

export const ClientChangePasswordSchema = (t:(key:string) => string ) => z.object({
  password: z.string().min(6, { message: t('password_required') }),
  password_confirmation: z.string().min(6, { message: t('password_confirmation_required') }),
}).refine((data) => data.password === data.password_confirmation, {
  message: t('passwords_must_match')
});

export const ProductsSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  name_ar: z.string().nonempty({ message: t('name_ar_required') }),
  description: z.string().nonempty({ message: t('description_required') }),
  description_ar: z.string().nonempty({ message: t('description_ar_required') }),
  price: z.string().nonempty( { message: t('price_required') }),
  //sale_price: z.string().nonempty( { message: t('sale_price_required') }),
  quantity: z.number().min(1, { message: t('quantity_required') }),
  brand_id: z.number().min(1, { message: t('brand_required') }),
  // has_free_shipping: z.boolean().default(false),
  // has_multi_color: z.boolean().default(false),
  // has_multi_size: z.boolean().default(false),
  // sku: z.string().nonempty({ message: t('sku_required') }),
  categories: z.array(z.number()).min(1, { message: t('categories_required') }),
  // colors: z.array(z.number()).min(1, { message: t('colors_required') }),
  // sizes: z.array(z.number()).min(1, { message: t('sizes_required') }),
  main_image: z
    .instanceof(File, { message: "The main image field must be a file." })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message:
          "The main image field must be a file of type: jpg, png, webp, jpeg.",
      }
    )
    .optional(),
});

export const AnnouncementSchema = (t:(key:string) => string ) => z.object({
  name: z.string().nonempty({ message: t('name_required') }),
  message: z.string().nonempty({ message: t('message_required') }),
  start_at: z.string().nonempty({ message: t('start_at_required') }),
  end_at: z.string().nonempty({ message: t('end_at_required') }),
  //is_active: z.string().nonempty({ message: t('is_active_required') }),
});