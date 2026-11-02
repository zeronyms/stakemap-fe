'use client';
import dynamic from 'next/dynamic';
import { DataTable } from '@/components/data-table';
import { projectColumns } from '@/components/proyek/project-columns';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store/project-store';
import { ProjectForm } from '@/components/proyek/ProjectForm';
import { useState, useEffect } from 'react';
import { ProjectType } from '@/types/project';
import { parseKoordinat } from '@/lib/koordinat';

// Leaflet needs `window`, so render the map on the client only
const ProjectMap = dynamic(() => import('@/components/proyek/ProjectMap'), {
  ssr: false,
});

export default function Home() {
  const { projects, fetchProjects } = useProjectStore();
  const [open, setOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Get center position from first project or default
  const defaultPosition: [number, number] = [-6.2088, 106.8456]; // Jakarta as default
  const initialCenter =
    projects.length > 0 && projects[0].koordinat
      ? parseKoordinat(projects[0].koordinat) || defaultPosition
      : defaultPosition;

  const currentCenter = mapCenter || initialCenter;

  // Handle row click to center map on project
  const handleRowClick = (project: ProjectType) => {
    const position = parseKoordinat(project.koordinat);
    if (position) {
      setMapCenter(position);
      setSelectedProjectId(project.id);
    }
  };

  console.log(projects);

  return (
    <main className='space-y-6 p-6'>
      <ProjectMap
        projects={projects}
        currentCenter={currentCenter}
        selectedProjectId={selectedProjectId}
      />
      <Button onClick={() => setOpen(true)}>Tambah Proyek</Button>
      <DataTable
        columns={projectColumns}
        data={projects}
        onRowClick={handleRowClick}
      />
      <ProjectForm open={open} onOpenChange={setOpen} />
    </main>
  );
}
