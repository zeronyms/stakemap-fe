'use client';
import 'leaflet/dist/leaflet.css';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { ProjectType } from '@/types/project';
import { parseKoordinat } from '@/lib/koordinat';

// Fix for default marker icon in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to update map center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15, {
      animate: true,
      duration: 1,
    });
  }, [center, map]);

  return null;
}

type ProjectMapProps = {
  projects: ProjectType[];
  currentCenter: [number, number];
  selectedProjectId: string | null;
};

export default function ProjectMap({
  projects,
  currentCenter,
  selectedProjectId,
}: ProjectMapProps) {
  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={currentCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '50vh', width: '100%' }}
      >
        <MapUpdater center={currentCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {/* Render Circle with radius in meters for each project */}
        {projects.map((project) => {
          const position = parseKoordinat(project.koordinat);
          if (!position) return null;

          const isSelected = project.id === selectedProjectId;

          return (
            <>
              {/* Circle with radius in meters */}
              <Circle
                key={`circle-${project.id}`}
                center={position}
                radius={project.radius}
                pathOptions={{
                  color: isSelected ? 'blue' : 'red',
                  fillColor: isSelected ? 'blue' : 'red',
                  fillOpacity: 0.2,
                }}
              />
              {/* Marker at center point */}
              <Marker key={`marker-${project.id}`} position={position}>
                <Popup>
                  <div className='space-y-1'>
                    <h3 className='font-semibold'>{project.nama_proyek}</h3>
                    <p className='text-sm text-gray-600'>
                      {project.alamat_proyek}
                    </p>
                    <p className='text-sm'>
                      Kategori: {project.kategori_proyek}
                    </p>
                    <p className='text-sm'>Radius: {project.radius}m</p>
                  </div>
                </Popup>
              </Marker>
            </>
          );
        })}
      </MapContainer>
    </div>
  );
}
