import React from 'react';
import { ChevronRight } from 'lucide-react';

// Tipe untuk setiap item di breadcrumb
interface BreadcrumbItem {
  label: string;
  href?: string; 
}

interface BreadcrumbProps {
  paths: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-1">
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          {/* Jika item memiliki href, buat menjadi link */}
          {path.href ? (
            <a href={path.href} className="hover:text-primary-600 hover:underline">
              {path.label}
            </a>
          ) : (
            // Jika tidak, tampilkan sebagai teks biasa (halaman aktif)
            <span className="font-medium text-gray-250">{path.label}</span>
          )}

          {/* Tampilkan separator jika bukan item terakhir */}
          {index < paths.length - 1 && (
            <ChevronRight size={16} className="mx-1.5" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;