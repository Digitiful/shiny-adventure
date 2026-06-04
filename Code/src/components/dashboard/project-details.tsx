
'use client';

import { projectDetailsData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';

export function ProjectDetails() {
    const { name, logoUrl, slogan, colors } = projectDetailsData;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 relative bg-white rounded-lg p-2 border shadow-sm">
                        <Image
                            src={logoUrl}
                            alt={`${name} logo`}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-base">{name}</h3>
                        <p className="text-sm text-muted-foreground">{slogan}</p>
                    </div>
                </div>
                
                <h4 className="text-sm font-semibold mb-2 text-foreground">Brand Colors</h4>
                <div className="flex items-center gap-2">
                    {colors.map((color, index) => (
                        <div key={index} className="h-8 w-8 rounded-md border-2 border-border/50" style={{ backgroundColor: color }} title={color} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
