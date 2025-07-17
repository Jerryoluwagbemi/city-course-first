import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Check,
  Calendar as CalendarIcon,
  Users,
  Shield,
  Clock,
  Euro,
  ChevronRight,
  ChevronLeft,
  MapPin
} from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const { services, cities } = useBooking();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    city: '',
    service: '',
    duration: 2,
    startDate: undefined as Date | undefined,
    numberOfStudents: 1,
  });

  const totalSteps = 4;
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

    if (currentStep === totalSteps) {
      setShowLoginPrompt(true);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Verified Accounts',
      description: 'All users go through email verification for security'
    },
    {
      icon: CalendarIcon,
      title: 'Flexible Duration',
      description: 'Choose from 2-24 week course packages'
    },
    {
      icon: Users,
      title: 'Group Pricing',
      description: 'Live calculator shows cost per student'
    },
    {
      icon: Clock,
      title: 'Fast Response',
      description: 'First provider to respond gets the booking'
    },
    {
      icon: Euro,
      title: 'Invoice Billing',
      description: 'Pay after service completion via bank transfer'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CourseBook</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Booking Form */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold font-serif mb-6">
                Book Your Course in Simple Steps
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Connect with verified language course providers in your city. 
                Get instant pricing and secure your spot with our streamlined booking platform.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <feature.icon className="w-5 h-5 text-white/90 mt-1" />
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-white/75">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form Card */}
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Progress value={progress} className="h-2 mb-4" />
                  <div className="flex justify-between text-sm">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span className="text-muted-foreground">
                      {currentStep === 1 && "Select City"}
                      {currentStep === 2 && "Choose Course"}
                      {currentStep === 3 && "Pick Dates"}
                      {currentStep === 4 && "Review"}
                    </span>
                  </div>
                </div>

                {/* Step 1: City Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label htmlFor="city" className="text-lg">Where would you like to take the course?</Label>
                    <Select value={bookingData.city} onValueChange={(value) => setBookingData(prev => ({ ...prev, city: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.name}>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {city.name}
                            </div>
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
                      <Label className="text-lg">What type of course do you need?</Label>
                      <Select value={bookingData.service} onValueChange={(value) => setBookingData(prev => ({ ...prev, service: value }))}>
                        <SelectTrigger className="h-12 mt-2">
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
                      <Label className="text-lg">Course Duration</Label>
                      <div className="grid grid-cols-4 gap-3 mt-2">
                        {durationOptions.map(weeks => (
                          <Button
                            key={weeks}
                            variant={bookingData.duration === weeks ? "default" : "outline"}
                            onClick={() => setBookingData(prev => ({ ...prev, duration: weeks }))
                            }
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
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg">When would you like to start?</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 mt-2 justify-start text-left font-normal"
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
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg">Number of Students</Label>
                      <Input
                        type="number"
                        min="1"
                        value={bookingData.numberOfStudents}
                        onChange={(e) => setBookingData(prev => ({ ...prev, numberOfStudents: parseInt(e.target.value) || 1 }))
                        }
                        className="h-12"
                      />
                    </div>

                    {bookingData.startDate && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Course Duration Summary:</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Start Date:</span>
                            <span className="font-medium">{format(bookingData.startDate, "PPP")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>End Date:</span>
                            <span className="font-medium">{endDate ? format(endDate, "PPP") : "N/A"}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span>Duration:</span>
                            <span className="font-medium">{bookingData.duration} weeks</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City:</span>
                          <span className="font-medium">{bookingData.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Course:</span>
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
                          <span className="text-muted-foreground">Students:</span>
                          <span className="font-medium">{bookingData.numberOfStudents}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Price per student:</span>
                            <span className="font-medium">€{pricePerStudent}</span>
                          </div>
                          <div className="flex justify-between border-t border-primary/20 pt-2 font-bold">
                            <span>Total Price:</span>
                            <span>€{totalPrice}</span>
                          </div>
                          <p className="text-sm text-muted-foreground text-center mt-2">
                            Payment via invoice after service completion
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button onClick={handleNext}>
                    {currentStep === totalSteps ? "Complete Booking" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login/Register Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              To confirm your booking, please sign in or create an account. This helps us keep track of your bookings and send you important updates.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Button onClick={() => navigate('/login')} className="w-full">
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CourseBook?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <CalendarIcon className="w-6 h-6 text-primary mr-2" />
            <span className="text-xl font-bold">CourseBook</span>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CourseBook. All rights reserved.</p>
            <div className="mt-2">
              <Button variant="link" className="text-xs">Privacy Policy</Button>
              <Button variant="link" className="text-xs">Terms of Service</Button>
              <Button variant="link" className="text-xs">GDPR Compliance</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;