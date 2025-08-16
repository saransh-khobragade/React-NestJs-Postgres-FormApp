import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formService } from '@/services/formService';
import { toast } from 'sonner';

export const FormResponses: React.FC<{ formId: number }> = ({ formId }) => {
  const [rows, setRows] = useState<{ id: number; answers: Record<string, unknown>; createdAt: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token') ?? '';
    formService
      .responses(token, formId)
      .then(setRows)
      .catch(() => toast.error('Failed to load responses'));
  }, [formId]);

  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Answers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <pre className='text-xs whitespace-pre-wrap'>{JSON.stringify(r.answers, null, 2)}</pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

