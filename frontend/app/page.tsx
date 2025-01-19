import PdfGeneratorForm from './components/PdfGeneratorForm';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">PDF Generator</h1>
      <PdfGeneratorForm />
      <Toaster position="top-right" />
    </main>
  );
}