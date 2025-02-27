
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { format, addWeeks, startOfWeek } from "date-fns";
import { Download, Users, Briefcase, TrendingUp } from "lucide-react";
import CapacityChart from "@/components/CapacityChart";
import RoleCapacityChart from "@/components/RoleCapacityChart";
import AvailabilityTable from "@/components/AvailabilityTable";
import PlannedRolesTable from "@/components/PlannedRolesTable";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("availability");
  const [weeks, setWeeks] = useState<number>(12);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addWeeks(new Date(), 12));
  const [minFte, setMinFte] = useState<number>(0);
  const [maxFte, setMaxFte] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Simulating authentication
  
  // Simulated metrics data
  const metrics = {
    totalFteDays: 248,
    activeTeamMembers: 12,
    plannedProjects: 8,
    netAvailableFteDays: 120
  };

  useEffect(() => {
    // Update end date when weeks or start date changes
    setEndDate(addWeeks(startDate, weeks));
  }, [weeks, startDate]);

  const handleWeeksChange = (value: number[]) => {
    setWeeks(value[0]);
  };

  const handleExportData = (type: string) => {
    setIsLoading(true);
    
    // Simulate export operation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Export Successful",
        description: `Your ${type} data has been exported.`,
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Capacity Allocator</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Adjust your dashboard settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weeks">Number of Weeks: {weeks}</Label>
                  <Slider 
                    id="weeks"
                    defaultValue={[weeks]} 
                    min={1} 
                    max={52} 
                    step={1} 
                    onValueChange={handleWeeksChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="border rounded-md">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>FTE Range</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={minFte}
                      onChange={(e) => setMinFte(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span>to</span>
                    <Input 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={maxFte}
                      onChange={(e) => setMaxFte(parseFloat(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input 
                    id="search"
                    type="text" 
                    placeholder="Search by name or project" 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchText("");
                    setMinFte(0);
                    setMaxFte(1);
                    setStartDate(new Date());
                    setWeeks(12);
                  }}
                >
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
            
            {/* Metrics Display */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Users className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500">Team Members</p>
                    <p className="text-2xl font-bold">{metrics.activeTeamMembers}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Briefcase className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-2xl font-bold">{metrics.plannedProjects}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white col-span-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500">Total FTE Days</p>
                      <p className="text-2xl font-bold">{metrics.totalFteDays}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500">Net Available</p>
                      <p className="text-2xl font-bold">{metrics.netAvailableFteDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="availability" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="availability">Current Availability</TabsTrigger>
                <TabsTrigger value="planned">Planned Roles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="availability" className="space-y-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Total FTE Availability</CardTitle>
                      <CardDescription>
                        {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('capacity')}
                      disabled={isLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CapacityChart 
                        startDate={startDate} 
                        endDate={endDate} 
                        weeks={weeks}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Role-based FTE Availability</CardTitle>
                      <CardDescription>Breakdown by role</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('roles')}
                      disabled={isLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <RoleCapacityChart 
                        startDate={startDate} 
                        endDate={endDate} 
                        weeks={weeks}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Filtered Availability Data</CardTitle>
                      <CardDescription>
                        {searchText ? `Search: "${searchText}"` : 'All team members'}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('availability')}
                      disabled={isLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityTable 
                      startDate={startDate}
                      endDate={endDate}
                      searchText={searchText}
                      minFte={minFte}
                      maxFte={maxFte}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="planned" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Planned Roles</CardTitle>
                    <CardDescription>Manage team allocation to projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PlannedRolesTable 
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
