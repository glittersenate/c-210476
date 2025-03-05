
import { format } from "date-fns";
import * as XLSX from "xlsx";

// Export chart as PNG using html2canvas
export const exportChartAsPNG = async (chartId: string, filename: string) => {
  try {
    // Dynamically import html2canvas to avoid server-side rendering issues
    const html2canvas = (await import("html2canvas")).default;
    
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      throw new Error(`Chart element with ID ${chartId} not found.`);
    }
    
    const canvas = await html2canvas(chartElement, {
      backgroundColor: null,
      scale: 2, // Better resolution
    });
    
    // Create a link element to download the image
    const link = document.createElement("a");
    link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error exporting chart:", error);
    return false;
  }
};

// Export data to Excel
export const exportToExcel = (data: any[], filename: string) => {
  try {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

// Convert chart data for Excel export
export const prepareChartDataForExcel = (chartData: any[]) => {
  return chartData.map((item) => {
    // Remove any nested objects that can't be represented in Excel
    const exportItem: any = { ...item };
    Object.keys(exportItem).forEach((key) => {
      if (typeof exportItem[key] === "object" && exportItem[key] !== null) {
        delete exportItem[key];
      }
    });
    return exportItem;
  });
};

// Format table data for Excel export
export const prepareTableDataForExcel = (data: any[]) => {
  return data.map((item) => {
    const exportItem: any = { ...item };
    
    // Convert nested objects to string representations
    // For example, convert allocations array to a string
    if (exportItem.allocations) {
      exportItem.allocations = exportItem.allocations.map((a: any) => 
        `${a.projectName} (${a.allocation.toFixed(1)})`
      ).join(", ");
    }
    
    // Convert weekly availability to individual columns
    if (exportItem.weeklyAvailability) {
      exportItem.weeklyAvailability.forEach((week: any) => {
        exportItem[`Week ${week.week + 1}`] = week.availableFte;
      });
      delete exportItem.weeklyAvailability;
    }
    
    return exportItem;
  });
};
