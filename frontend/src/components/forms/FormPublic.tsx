import React, { useEffect, useState } from 'react';
import { formService } from '@/services/formService';
import type { FormDto } from '@/types/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const FormPublic: React.FC = () => {
  const idMatch = (/#\/form\/(\d+)/u).exec(window.location.hash || '');
  const id = idMatch ? Number(idMatch[1]) : NaN;
  const [form, setForm] = useState<FormDto | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!Number.isNaN(id)) {
      formService
        .get(id)
        .then(setForm)
        .catch(() => toast.error('Failed to load form'));
    }
  }, [id]);

  const submit = async (): Promise<void> => {
    if (!form) return;
    try {
      await formService.submit(form.id, { answers });
      toast.success('Response submitted');
    } catch {
      toast.error('Failed to submit');
    }
  };

  if (!form) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {form.questions.map(q => (
            <div key={q.id ?? q.text} className='space-y-2'>
              <div className='font-medium'>{q.text}</div>
              {q.type === 'text' ? (
                <Input onChange={(e) => { setAnswers(prev => ({ ...prev, [String(q.id ?? q.text)]: e.target.value })); }} />
              ) : (
                <div className='space-y-2'>
                  {(q.options ?? []).map(opt => (
                    <label key={opt} className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name={`q_${String(q.id ?? q.text)}`}
                        value={opt}
                        onChange={() => { setAnswers(prev => ({ ...prev, [String(q.id ?? q.text)]: opt })); }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button onClick={async () => { try { await submit(); } catch { /* ignore */ } }}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

