import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Question } from '@/types/form';
import { useAuth } from '@/contexts/AuthContext';
import { formService } from '@/services/formService';
import { toast } from 'sonner';

export const CreateForm: React.FC<{ onCreated: (formId: number) => void }> = ({ onCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addText = (): void => { setQuestions(prev => [...prev, { text: '', type: 'text' }]); };
  const addMcq = (): void => { setQuestions(prev => [...prev, { text: '', type: 'mcq', options: [''] }]); };

  const updateQuestion = (idx: number, update: Partial<Question>): void => {
    setQuestions(qs => qs.map((q, i) => (i === idx ? { ...q, ...update } : q)));
  };

  const updateOption = (qIdx: number, optIdx: number, value: string): void => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, options: (q.options ?? []).map((o, j) => (j === optIdx ? value : o)) } : q,
      ),
    );
  };

  const addOption = (qIdx: number): void => {
    setQuestions(qs => qs.map((q, i) => (i === qIdx ? { ...q, options: [...(q.options ?? []), ''] } : q)));
  };

  const handleCreate = async (): Promise<void> => {
    if (!user) return;
    if (!title.trim() || questions.length === 0) {
      toast.error('Title and at least one question are required');
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token') ?? '';
      const form = await formService.create(token, { title, questions });
      toast.success('Form created');
      onCreated(form.id);
    } catch {
      toast.error('Failed to create form');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Form</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Form title</Label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); }} placeholder='Untitled form' />
          </div>
          <div className='space-y-3'>
            {questions.map((q, idx) => (
              <Card key={String(idx)} className='p-4 space-y-3'>
                <div className='space-y-2'>
                  <Label>Question</Label>
                  <Input value={q.text} onChange={(e) => { updateQuestion(idx, { text: e.target.value }); }} />
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant={q.type === 'text' ? 'default' : 'outline'} onClick={() => { updateQuestion(idx, { type: 'text' }); }}>Text</Button>
                  <Button variant={q.type === 'mcq' ? 'default' : 'outline'} onClick={() => { updateQuestion(idx, { type: 'mcq', options: q.options ?? [''] }); }}>Multiple choice</Button>
                </div>
                {q.type === 'mcq' && (
                  <div className='space-y-2'>
                    <Label>Options</Label>
                    {(q.options ?? []).map((opt, j) => (
                      <Input key={String(j)} value={opt} onChange={(e) => { updateOption(idx, j, e.target.value); }} placeholder={`Option ${String(j + 1)}`} />
                    ))}
                    <Button variant='outline' onClick={() => { addOption(idx); }}>Add option</Button>
                  </div>
                )}
              </Card>
            ))}
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => { addText(); }}>Add text question</Button>
              <Button variant='outline' onClick={() => { addMcq(); }}>Add multiple choice</Button>
            </div>
          </div>
          <div className='pt-2'>
            <Button onClick={async () => { try { await handleCreate(); } catch { /* ignore */ } }} disabled={isSaving}>Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

