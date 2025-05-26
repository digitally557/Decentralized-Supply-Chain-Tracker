import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  itemId: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ itemId, size = 128 }) => {
  // Generate a URL that points to the item detail page
  const appBaseUrl = window.location.origin;
  const itemUrl = `${appBaseUrl}/items/${itemId}`;
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCodeSVG 
          value={itemUrl}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#002B5B"
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">Scan to view item details</p>
      <p className="mt-1 text-xs text-gray-500 font-mono">{itemId}</p>
    </div>
  );
};

export default QRCodeGenerator;