'use client';

import { useForm } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

type FormInputs = {
  name: string;
  email: string;
  reportTitle: string;
  content: string;
  logoUrl: string;
  primaryColor: string;
};

export default function PdfGeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#000000");
  const [preview, setPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      primaryColor: "#000000",
      logoUrl: '',
    }
  });

  
  const formValues = watch();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/generate-pdf`,
        {
          ...data,
          primaryColor: color,
        }
      );
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Report Title</label>
          <input
            {...register("reportTitle", { required: "Report title is required" })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.reportTitle && (
            <span className="text-red-500 text-sm">{errors.reportTitle.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Report Content</label>
          <textarea
            {...register("content", { required: "Report content is required" })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            rows={4}
          />
          {errors.content && (
            <span className="text-red-500 text-sm">{errors.content.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Logo URL</label>
          <input
            {...register("logoUrl", {
              validate: (value) => 
                !value || validateUrl(value) || "Please enter a valid URL"
            })}
            placeholder="https://example.com/logo.png"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.logoUrl && (
            <span className="text-red-500 text-sm">{errors.logoUrl.message}</span>
          )}
          {formValues.logoUrl && validateUrl(formValues.logoUrl) && (
            <div className="mt-2">
              <img 
                src={formValues.logoUrl} 
                alt="Logo preview" 
                className="h-20 object-contain"
                onError={() => toast.error('Failed to load logo image')}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Primary Color</label>
          <HexColorPicker 
            color={color} 
            onChange={setColor}
            className="w-full"
          />
          <input 
            type="text" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="space-y-2">
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
        >
          {preview ? 'Hide Preview' : 'Show Preview'}
        </button>
        {preview && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Preview:</h3>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Name:</span> {formValues.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {formValues.email}
            </div>
            <div>
              <span className="font-semibold">Report Title:</span> {formValues.reportTitle}
            </div>
            <div>
              <span className="font-semibold">Report Content:</span>
              <p className="whitespace-pre-wrap">{formValues.content}</p>
            </div>
            <div>
              <span className="font-semibold">Logo URL:</span> {formValues.logoUrl}
            </div>
            <div>
              <span className="font-semibold">Primary Color:</span>
              <div className="flex items-center gap-2">
                {color}
                <div 
                  className="w-6 h-6 border rounded" 
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
        <div className="space-y-2"> 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate PDF'}
          </button>
          </div>

        
      </form>
    </div>
  );
}