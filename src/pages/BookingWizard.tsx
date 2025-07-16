import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Euro, Clock, MapPin } from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const BookingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { services, cities, createBooking } = useBooking();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    city: '',
    service: '',
    duration: 2, // weeks
    startDate: undefined as Date | undefined,
    numberOfStudents: 1,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const durationOptions = [2, 4, 6, 8, 10, 12, 24];

  const selectedService = services.find(s => s.id === bookingData.service);
  const pricePerStudent = selectedService ? selectedService.baseRate * bookingData.duration : 0;
  const totalPrice = pricePerStudent * bookingData.numberOfStudents;
  const endDate = bookingData.startDate ? addWeeks(bookingData.startDate, bookingData.duration) : undefined;

  const handleNext = () => {
    if (currentStep === 1 && !bookingData.city) {
      toast({
        title: "City Required",
        description: "Please select a city to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2 && (!bookingData.service || !bookingData.duration)) {
      toast({
        title: "Service & Duration Required",
        description: "Please select a service and duration to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3 && !bookingData.startDate) {
      toast({
        title: "Start Date Required",
        description: "Please select a start date to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 4 && bookingData.numberOfStudents < 1) {
      toast({
        title: "Number of Students Required",
        description: "Please enter the number of students.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!user || !bookingData.startDate || !endDate) return;

    createBooking({
      clientId: user.id,
      city: bookingData.city,
      service: selectedService?.name || '',
      duration: bookingData.duration,
      startDate: bookingData.startDate.toISOString(),
      endDate: endDate.toISOString(),
      numberOfStudents: bookingData.numberOfStudents,
      pricePerStudent,
      totalPrice
    });

    toast({
      title: "Booking Request Submitted!",
      description: "We've notified providers in your city. You'll hear back soon.",
    });

    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'City', icon: MapPin },
    { number: 2, title: 'Service', icon: Clock },
    { number: 3, title: 'Dates', icon: CalendarIcon },
    { number: 4, title: 'Students', icon: Users },
    { number: 5, title: 'Review', icon: Euro }
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Book a Course</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Select Your City"}
              {currentStep === 2 && "Choose Service & Duration"}
              {currentStep === 3 && "Pick Your Start Date"}
              {currentStep === 4 && "Number of Students"}
              {currentStep === 5 && "Review Your Booking"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: City Selection */}
            {currentStep === 1 && (
              <div>
                <Label htmlFor="city" className="text-base">Where would you like to take the course?</Label>
                <Select value={bookingData.city} onValueChange={(value) => setBookingData(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 2: Service & Duration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="service" className="text-base">What type of course do you need?</Label>
                  <Select value={bookingData.service} onValueChange={(value) => setBookingData(prev => ({ ...prev, service: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a course type" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground">€{service.baseRate}/week per student</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base">Course Duration</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {durationOptions.map(weeks => (
                      <Button
                        key={weeks}
                        variant={bookingData.duration === weeks ? "default" : "outline"}
                        onClick={() => setBookingData(prev => ({ ...prev, duration: weeks }))}
                        className="h-12"
                      >
                        {weeks} weeks
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Date Selection */}
            {currentStep === 3 && (
              <div>
                <Label className="text-base">When would you like to start?</Label>
                <div className="mt-4 space-y-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !bookingData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.startDate ? format(bookingData.startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.startDate}
                        onSelect={(date) => setBookingData(prev => ({ ...prev, startDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {bookingData.startDate && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Course Duration Summary:</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Start Date:</span>
                        <span>{format(bookingData.startDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">End Date:</span>
                        <span>{endDate ? format(endDate, "PPP") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-primary font-medium">
                        <span>Duration:</span>
                        <span>{bookingData.duration} weeks</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Number of Students */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="students" className="text-base">How many students will attend?</Label>
                  <Input
                    id="students"
                    type="number"
                    min="1"
                    max="100"
                    value={bookingData.numberOfStudents}
                    onChange={(e) => setBookingData(prev => ({ ...prev, numberOfStudents: parseInt(e.target.value) || 1 }))}
                    className="mt-2 h-12 text-lg"
                  />
                </div>

                {/* Live Price Calculator */}
                <div className="p-6 bg-gradient-primary text-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Live Price Calculator</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{bookingData.duration} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per student:</span>
                      <span className="font-medium">€{pricePerStudent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of students:</span>
                      <span className="font-medium">{bookingData.numberOfStudents}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total Price:</span>
                        <span>€{totalPrice}</span>
                      </div>
                      <p className="text-sm mt-2 text-white/80">
                        Payment via invoice after service completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City:</span>
                        <span className="font-medium">{bookingData.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{bookingData.duration} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">
                          {bookingData.startDate ? format(bookingData.startDate, "PPP") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">
                          {endDate ? format(endDate, "PPP") : "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{bookingData.numberOfStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per student:</span>
                        <span className="font-medium">€{pricePerStudent}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary">€{totalPrice}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-full justify-center">
                        Payment after service completion
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                  <h4 className="font-medium text-info mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Your booking request will be sent to verified providers in {bookingData.city}</li>
                    <li>• The first provider to respond will secure your booking</li>
                    <li>• You'll receive a confirmation email with all details</li>
                    <li>• Payment will be requested after course completion</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-primary">
                  Submit Booking Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingWizard;