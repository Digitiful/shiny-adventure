
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleContentAnalysis } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ScanLine, User, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const initialState = {
  analysis: null,
  message: '',
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <ScanLine className="mr-2 h-4 w-4" />
          Analyze Content
        </>
      )}
    </Button>
  );
}

const ScoreIndicator = ({ score }: { score: number }) => {
    const getScoreColor = (s: number) => {
        if (s < 40) return 'bg-destructive';
        if (s < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    }
    
    const indicatorIcon = score >= 60 ? <User className="h-8 w-8 text-green-500" /> : <Bot className="h-8 w-8 text-destructive" />;
    const indicatorText = score >= 60 ? "Likely Human-Written" : "Likely Machine-Generated";

    return (
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-3">
                {indicatorIcon}
                <span className="text-2xl font-bold">{indicatorText}</span>
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-muted-foreground">Machine Score</span>
                    <span className="font-bold text-foreground">{100-score}%</span>
                    <span className="font-medium text-muted-foreground">Human Score</span>
                </div>
                <Progress value={score} indicatorClassName={cn("transition-all duration-500", getScoreColor(score))} />
                 <div className="text-center mt-2">
                    <p className="text-4xl font-bold text-foreground">{score}%</p>
                    <p className="font-medium text-muted-foreground">Human Score</p>
                </div>
            </div>
        </div>
    )
}


export default function AiContentAnalyzerPage() {
  const [state, formAction] = useActionState(handleContentAnalysis, initialState);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Content Analyzer</CardTitle>
              <CardDescription>
                Paste any text to determine if it was written by a machine or a human.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textToAnalyze">Text to Analyze</Label>
              <Textarea
                id="textToAnalyze"
                name="textToAnalyze"
                placeholder="Paste your text here..."
                className="min-h-[200px]"
              />
            </div>
             {state.status === 'error' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.status === 'success' && state.analysis && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <ScoreIndicator score={state.analysis.humanScore} />
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold text-foreground">Rationale:</h4>
                <ul className="text-muted-foreground">
                    {state.analysis.analysis.split('\n').map((item: string, index: number) => 
                        item.trim() && <li key={index}>{item.replace(/^-/, '').trim()}</li>
                    )}
                </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
