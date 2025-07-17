import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const Tickets = () => {
  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-lg font-semibold">Tickets & Messages</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Ticket/message list goes here */}
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">Your support tickets and messages will appear here.</p>
              <Button>New Ticket</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tickets;
