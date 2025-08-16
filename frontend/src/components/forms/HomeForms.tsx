import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formService } from '@/services/formService';
import type { FormDto } from '@/types/form';
import { toast } from 'sonner';

export const HomeForms: React.FC<{ onCreate: () => void; onOpen: (id: number) => void }> = ({ onCreate, onOpen }) => {
  const [forms, setForms] = useState<FormDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') ?? '';
    formService
      .listMine(token)
      .then(setForms)
      .catch(() => toast.error('Failed to load forms'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Your Forms</h2>
        <Button onClick={() => { onCreate(); }}>Create Form</Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {forms.map(f => (
          <Card key={f.id} className='hover:shadow'>
            <CardHeader>
              <CardTitle className='text-base'>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className='flex items-center justify-between'>
              <Button variant='outline' onClick={() => { onOpen(f.id); }}>Open</Button>
              <Button
                variant='outline'
                onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/#/form/${String(f.id)}`); } catch { /* ignore */ } }}
              >
                Copy Link
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

