import React, { useState } from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons'; //untuk feater

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const DiabetesDetailScreen: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
        id: 1,
        title: 'Atur pola makan',
        description: '...',
        // Apple ada di MaterialCommunityIcons
        icon: <MaterialCommunityIcons name="apple" size={24} color="black" />, 
        completed: false,
    },
    {
      id: 2,
      title: 'Olahraga rutin',
      description: '30 menit jalan kaki, minimal 5x seminggu.',
      // Activity ada di Feather
      icon: <Feather name="activity" size={24} color="black" />,
      completed: false,
    },
    {
      id: 3,
      title: 'Konsumsi obat',
      description: 'Sesuai resep dokter endokrinologi.',
      icon: <MaterialCommunityIcons name="pill" size={24} color="black" />,
      completed: false,
    },
    {
      id: 4,
      title: 'Monitor gula darah',
      description: 'Cek setiap hari: puasa & 2 jam sesudah makan.',
      icon: <Ionicons name="water" size={24} color="black" />,
      completed: false,
    },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-[#5EEAD4] min-h-screen p-6 font-sans relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <button className="bg-white/20 p-2 rounded-full border border-black/10">
            {/* Ganti <ChevronLeft /> jadi ini */}
            <Feather name="chevron-left" size={24} color="black" />
          </button>
          <h1 className="text-[#1E1B4B] text-xl font-bold">Lihat Detail</h1>
          <div className="bg-black rounded-full p-1">
            {/* Ganti <User /> jadi ini */}
            <Feather name="user" size={24} color="white" />
          </div>
        </div>

        {/* Hasil Deteksi Card */}
        <div className="bg-[#E6FFFA] rounded-[32px] p-6 border-2 border-blue-400 shadow-sm mb-6">
          <p className="text-gray-600 text-sm mb-1">Hasil deteksi foto pasien</p>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Diabetes</h2>
            <span className="bg-[#C6F6D5] text-[#3182CE] px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
              Terdeteksi
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            Terjadi peningkatan kadar gula darah dalam tubuh dikarenakan hormon insulin tidak bekerja secara efektif.
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span>Risiko Komplikasi</span>
              <span className="text-red-500">Sedang - 75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#84A55A] h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <h3 className="font-bold text-gray-800 mb-4">Checklist sebelum check ulang</h3>
        <div className="bg-[#E6FFFA] rounded-[32px] p-4 mb-6 space-y-4">
          {checklist.map((item) => (
            <div 
                key={item.id} 
                className="flex items-start gap-4 p-2 border-b border-gray-200 last:border-0 cursor-pointer"
                onClick={() => toggleCheck(item.id)}
            >
              <div className="mt-1">{item.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-[11px] text-gray-500">{item.description}</p>
              </div>
              <input 
                type="checkbox" 
                checked={item.completed}
                readOnly
                className="w-6 h-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
              />
            </div>
          ))}
        </div>

        {/* Warning Card */}
        <div className="bg-[#D1E7DD] rounded-[24px] p-4 flex gap-4 items-center border border-gray-300">
          <div className="bg-black p-2 rounded-lg">
            {/* Ganti <AlertTriangle /> jadi ini */}
            <Feather name="alert-triangle" size={20} color="white" />
          </div>
          <div>
            <h4 className="text-red font-bold">Perhatian</h4>
            <p className="text-[11px] text-gray-700">
              HbA1c terakhir 8.2% — di atas target &lt;7%. Jadwalkan konsultasi segera.
            </p>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="w-32 h-1 bg-black mx-auto mt-8 rounded-full"></div>
      </div>
    </div>
  );
};

export default DiabetesDetailScreen;