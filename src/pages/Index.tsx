
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
import { Download, Users, Briefcase, TrendingUp, Sparkles, LineChart, Calendar as CalendarIcon } from "lucide-react";
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
  const [plannedRolesData, setPlannedRolesData] = useState<any[]>([]);
  
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

  const handlePlannedRolesChange = (roles: any[]) => {
    setPlannedRolesData(roles);
  };

  return (
    <div className="min-h-screen dark bg-gradient-to-b from-[#0A0A1B] to-[#050208] text-[#FAFDFF]">
      <header className="bg-gradient-to-r from-[#111133] to-[#0F0F20] backdrop-blur-md border-b border-[#222244] shadow-lg">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#4243B5] to-[#0000FF] rounded-md flex items-center justify-center shadow-lg shadow-[#4243B5]/20">
                <TrendingUp className="text-[#FFFFFF] w-6 h-6" />
              </div>
              <h1 className="text-2xl font-semibold text-[#FAFDFF]">St<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4243B5] to-[#0000FF]">AI</span>ffing</h1>
            </div>
            <Button variant="ghost" className="text-[#C8C8F0] hover:text-[#FAFDFF] hover:bg-[#1A1A4A]/30">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#4243B5]" />
                  Configuration
                </CardTitle>
                <CardDescription className="text-[#A0A0C2]">Adjust your dashboard settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="weeks" className="text-[#C8C8F0] flex justify-between">
                    <span>Number of Weeks</span>
                    <span className="text-[#4243B5] font-medium">{weeks}</span>
                  </Label>
                  <Slider 
                    id="weeks"
                    defaultValue={[weeks]} 
                    min={1} 
                    max={52} 
                    step={1} 
                    onValueChange={handleWeeksChange}
                    className="[&>.bg-primary]:bg-gradient-to-r [&>.bg-primary]:from-[#4243B5] [&>.bg-primary]:to-[#0000FF] [&>span]:opacity-100 [&>span]:bg-gradient-to-r [&>span]:from-[#4243B5] [&>span]:to-[#0000FF] [&>span]:shadow-lg [&>span]:shadow-[#4243B5]/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#C8C8F0]">Start Date</Label>
                  <div className="border rounded-lg overflow-hidden border-[#222244] shadow-inner">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      className="rounded-md border-none bg-transparent text-[#FAFDFF]"
                      classNames={{
                        day_selected: "bg-gradient-to-r from-[#4243B5] to-[#0000FF] text-white hover:bg-[#4243B5]",
                        day_today: "bg-[#222244] text-[#FAFDFF]",
                        day_outside: "text-[#555577] opacity-50",
                        day: "hover:bg-[#222244] focus:bg-[#222244] focus:text-[#FAFDFF]",
                        nav_button: "hover:bg-[#222244] hover:text-[#FAFDFF]",
                        nav_button_previous: "hover:bg-[#222244] hover:text-[#FAFDFF]",
                        nav_button_next: "hover:bg-[#222244] hover:text-[#FAFDFF]",
                        caption: "text-[#C8C8F0]"
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#C8C8F0]">FTE Range</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={minFte}
                      onChange={(e) => setMinFte(parseFloat(e.target.value))}
                      className="w-20 focus-visible:ring-[#4243B5] bg-[#111133]/30 border-[#222244] text-[#FAFDFF] shadow-inner"
                    />
                    <span className="text-[#A0A0C2]">to</span>
                    <Input 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={maxFte}
                      onChange={(e) => setMaxFte(parseFloat(e.target.value))}
                      className="w-20 focus-visible:ring-[#4243B5] bg-[#111133]/30 border-[#222244] text-[#FAFDFF] shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-[#C8C8F0]">Search</Label>
                  <Input 
                    id="search"
                    type="text" 
                    placeholder="Search by name or project" 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="focus-visible:ring-[#4243B5] bg-[#111133]/30 border-[#222244] text-[#FAFDFF] shadow-inner"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#222244]/50 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-[#222244] text-[#A0A0C2] hover:bg-[#4243B5]/10 hover:text-[#FAFDFF] hover:border-[#4243B5]"
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
              <Card className="shadow-lg border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-gradient-to-r from-[#4243B5]/20 to-[#0000FF]/20 mb-2">
                      <Users className="h-7 w-7 text-[#4243B5]" />
                    </div>
                    <p className="text-sm text-[#A0A0C2] mt-1">Team Members</p>
                    <p className="text-2xl font-bold text-[#FAFDFF] mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FAFDFF] to-[#C8C8F0]">{metrics.activeTeamMembers}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-gradient-to-r from-[#4243B5]/20 to-[#0000FF]/20 mb-2">
                      <Briefcase className="h-7 w-7 text-[#4243B5]" />
                    </div>
                    <p className="text-sm text-[#A0A0C2] mt-1">Projects</p>
                    <p className="text-2xl font-bold text-[#FAFDFF] mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FAFDFF] to-[#C8C8F0]">{metrics.plannedProjects}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] col-span-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-[#A0A0C2]">Total FTE Days</p>
                      <p className="text-2xl font-bold text-[#FAFDFF] mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FAFDFF] to-[#C8C8F0]">{metrics.totalFteDays}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-[#A0A0C2]">Net Available</p>
                      <p className="text-2xl font-bold text-[#4243B5] mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#4243B5] to-[#0000FF]">{metrics.netAvailableFteDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="availability" onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="w-full grid grid-cols-2 bg-gradient-to-r from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md rounded-lg p-1 border border-[#222244]">
                <TabsTrigger 
                  value="availability" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4243B5] data-[state=active]:to-[#0000FF] data-[state=active]:text-[#FAFDFF] text-[#A0A0C2] py-2 rounded-md transition-all duration-300"
                >
                  Current Availability
                </TabsTrigger>
                <TabsTrigger 
                  value="planned"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4243B5] data-[state=active]:to-[#0000FF] data-[state=active]:text-[#FAFDFF] text-[#A0A0C2] py-2 rounded-md transition-all duration-300"
                >
                  Planned Roles
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="availability" className="space-y-8">
                <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                    <div>
                      <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-[#4243B5]" />
                        Total FTE Availability
                      </CardTitle>
                      <CardDescription className="text-[#A0A0C2]">
                        {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('capacity')}
                      disabled={isLoading}
                      className="border-[#222244] text-[#A0A0C2] hover:text-[#FAFDFF] hover:bg-[#4243B5]/10 hover:border-[#4243B5]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[300px]">
                      <CapacityChart 
                        startDate={startDate} 
                        endDate={endDate} 
                        weeks={weeks}
                        showSeries={["totalCapacity"]}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                    <div>
                      <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#4243B5]" />
                        Role-based FTE Availability
                      </CardTitle>
                      <CardDescription className="text-[#A0A0C2]">Breakdown by role</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('roles')}
                      disabled={isLoading}
                      className="border-[#222244] text-[#A0A0C2] hover:text-[#FAFDFF] hover:bg-[#4243B5]/10 hover:border-[#4243B5]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[400px]">
                      <RoleCapacityChart 
                        startDate={startDate} 
                        endDate={endDate} 
                        weeks={weeks}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                    <div>
                      <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[#4243B5]" />
                        Filtered Availability Data
                      </CardTitle>
                      <CardDescription className="text-[#A0A0C2]">
                        {searchText ? `Search: "${searchText}"` : 'All team members'}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('availability')}
                      disabled={isLoading}
                      className="border-[#222244] text-[#A0A0C2] hover:text-[#FAFDFF] hover:bg-[#4243B5]/10 hover:border-[#4243B5]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                    <div>
                      <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-[#4243B5]" />
                        Total FTE Capacity & Planned Usage
                      </CardTitle>
                      <CardDescription className="text-[#A0A0C2]">
                        {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportData('planned-capacity')}
                      disabled={isLoading}
                      className="border-[#222244] text-[#A0A0C2] hover:text-[#FAFDFF] hover:bg-[#4243B5]/10 hover:border-[#4243B5]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[300px]">
                      <CapacityChart 
                        startDate={startDate} 
                        endDate={endDate} 
                        weeks={weeks}
                        showSeries={["totalCapacity", "plannedCapacity", "netAvailable"]}
                        plannedRolesData={plannedRolesData}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-xl border-[#222244] bg-gradient-to-br from-[#111133]/90 to-[#0A0A20]/90 backdrop-blur-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#4243B5]/10 to-transparent border-b border-[#222244]/50">
                    <CardTitle className="text-[#FAFDFF] flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[#4243B5]" />
                      Planned Roles
                    </CardTitle>
                    <CardDescription className="text-[#A0A0C2]">Manage team allocation to projects</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PlannedRolesTable 
                      startDate={startDate}
                      endDate={endDate}
                      onRolesChange={handlePlannedRolesChange}
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
