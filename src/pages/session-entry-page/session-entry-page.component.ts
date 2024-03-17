import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Papa from 'papaparse';



@Component({
  selector: 'app-session-entry-page',
  templateUrl: './session-entry-page.component.html',
  styleUrls: ['./session-entry-page.component.css']
})
export class SessionEntryPageComponent {

  url = 'http://147.135.113.14:5000/v1/';
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;
  added: string | undefined;

  sessionEntry = new FormGroup({
    id: new FormControl(),
    winnings: new FormControl(),
    buy_in_amount: new FormControl(),
    buy_out_amount: new FormControl(),
    location: new FormControl(''),
    date: new FormControl(''),
  });

  locations = [
    {label: 'Home', value: 'home'},
    {label: 'Online', value: 'online'},
    {label: 'Casino', value: 'casino' },
  ]
  selectedFile: File;
  parsedData: any[];
  selectedRows: any[] = [];
  inputForm: FormGroup;

  inputDict = new Map<string, number>();
  csvDict = new Map<string, number>();
  diffName: string;
  diffNet: number;
  isEqual: boolean;


  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      names: ['', Validators.required],
      numbers: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.parseLedger();
  }

  submitForm() {
  const namesControl = this.inputForm.get('names');
  const numbersControl = this.inputForm.get('numbers');

  // Check if form controls are not null before accessing their values
  if (namesControl && numbersControl && namesControl.value && numbersControl.value) {
    const names = namesControl.value.split(' ');
    const numbers = numbersControl.value.split(' ');
    for(let i = 0; i < names.length; i++) {
      if(numbers[i] == 0){
        continue;
      } else {
        console.log("Adding name: ", names[i], " with net: ", numbers[i]*100);
        this.inputDict.set(names[i], numbers[i]*100);
      }
    }


    this.isEqual = this.compare();
    console.log("Name: ", this.diffName, " Amount: ", this.diffNet);

  } else {
    console.error('Form controls are null or undefined');
  }
  }


  compare() {

    console.log("csvSize: ", this.csvDict);
    if(this.csvDict.size !== this.inputDict.size) {
      return false;
    }

    // Step 1: Convert dictionary to array of key-value pairs
    const csvArray = Array.from(this.csvDict);

    console.log("csvArray: ", csvArray);

    // Step 2: Sort the array by keys
    csvArray.sort((a, b) => a[0].localeCompare(b[0]));

    // Step 3: Convert sorted array back to dictionary
    const sortedCsvDict: { [key: string]: any } = {};
    csvArray.forEach(([key, value]) => {
        sortedCsvDict[key] = value;
    });

    // Step 1: Convert dictionary to array of key-value pairs
    const inputArray = Array.from(this.inputDict);

    // Step 2: Sort the array by keys
    inputArray.sort((a, b) => a[0].localeCompare(b[0]));

    // Step 3: Convert sorted array back to dictionary
    const sortedInputDict: { [key: string]: any } = {};
    inputArray.forEach(([key, value]) => {
        sortedInputDict[key] = value;
    });

    for(let i = 0; i < this.csvDict.size; i++) {
      console.log("sortedCSV: ", csvArray[i][1]);
      if(csvArray[i][0].toLowerCase() != inputArray[i][0].toLowerCase()) {
        this.diffName = csvArray[i][0];
        return false;
      }
      if(csvArray[i][1] != inputArray[i][1]) {
        console.log("inputArray: ", inputArray[i][1]);
        this.diffNet = csvArray[i][1];
        return false;
      }
    }

    return true;
  }

  // onSubmit() {
  //   const sessionForm = this.sessionEntry.value;
  //   const entry = {
  //     id: sessionForm.id,
  //     winnings: sessionForm.winnings,
  //     buy_in_amount: sessionForm.buy_in_amount,
  //     buy_out_amount: sessionForm.buy_out_amount,
  //     location: sessionForm.location,
  //     date: sessionForm.date
  //   }

  //   this.http.post( this.url + 'session/entry', entry)

  //   .subscribe((res: any) => {
  //     this.added = res.detail;
  //     this.sessionEntry.reset();
  //     setTimeout(() => {
  //       this.added = undefined;
  //     }, 2500)
  //   });
  // }

  parseLedger() {
    Papa.parse(this.selectedFile, {
      complete: (result: any) => {
        this.parsedData = result.data;
        console.log('Parsed CSV data:', this.parsedData);
        this.filterZeros();
        this.autoCombineRows();
        // You can further process the parsed data here
      },
      header: true // If the CSV has headers
    });
  }

  filterZeros() {
    this.parsedData = this.parsedData.filter(row => row.net != 0);
    this.parsedData = this.parsedData.filter(row => row.player_nickname != "");
  }

  getColumnHeaders(data: any[]): string[] {
    if (!data || data.length === 0) {
      return [];
    }

    const selectedColumns = ['player_nickname', 'player_id', 'net'];

     // Find the first non-empty row
    const headersRow = data.find(row => Object.values(row).some(value => value !== undefined && value !== null));

    // Extract keys from the row (headers) and filter only selected columns
    return headersRow ? Object.keys(headersRow).filter(key => selectedColumns.includes(key)) : [];
  }

  getTotalNet(): number {
    let total = 0;
    if (this.parsedData && this.parsedData.length > 0) {
      this.parsedData.forEach(row => {
        // Assuming 'Net' is the key for the net value
        total += parseFloat(row['Net'] || 0);
      });
    }
    return total;
  }

  updateCellValue(event: any) {
    const targetElement = event.target as HTMLTableCellElement;
    const value = targetElement.innerText.trim();
  
    let rowIndex = -1;
    // Find the closest row element
    let rowElement = targetElement.parentElement;
    while (rowElement && rowElement.tagName !== 'TR') {
      rowElement = rowElement.parentElement;
    }
    if (rowElement && rowElement.parentElement) {
      rowIndex = Array.from(rowElement.parentElement.children).indexOf(rowElement);
    }
    
    if (rowIndex !== -1 && this.parsedData[rowIndex]) {
      const colIndex = targetElement.cellIndex-1;
      console.log("header: ", this.getColumnHeaders(this.parsedData), "with value: ", value, " and column index as: ", colIndex);
      const header = this.getColumnHeaders(this.parsedData)[colIndex];
      this.parsedData[rowIndex][header] = value;
    }
  }
  
  
  
  

  onSubmit(event: Event): void {
    // const formData = new FormData();
    // formData.append('csvFile', this.selectedFile);

    // this.parseLedger();
    
    console.log("parsed Data: ", this.parsedData)

    for(let i = 0; i < this.parsedData.length; i++) {
      this.csvDict.set(this.parsedData[i].player_nickname,this.parsedData[i].net);
    }
    // console.log("formData: ", formData);

    event.preventDefault();
    // this.http.post('/upload', formData).subscribe(
    //   (response) => {
    //     console.log('File uploaded successfully');
    //     // Handle response as needed
    //   },
    //   (error) => {
    //     console.error('Error uploading file:', error);
    //   }
    // );
  }

  selectRow(row: any) {
    const index = this.selectedRows.findIndex(selectedRow => selectedRow === row);
    if (index !== -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
  }


  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }


  // combineRows() {
  //   console.log("select length: ", this.selectedRows.length);
  //   if (this.selectedRows.length === 2) {
  //     const netSum = this.selectedRows.reduce((acc, row) => acc + (parseFloat(row['net']) || 0), 0);
  //     const combinedRow = { ...this.selectedRows[0] }; // Choose the first row for all other fields
  //     combinedRow['net'] = netSum;
  //     this.parsedData.push(combinedRow); // Add the combined row to the table
  //     // Remove the selected rows from the table
  //     this.parsedData = this.parsedData.filter(row => !this.selectedRows.includes(row));
  //     this.selectedRows = []; // Clear selected rows
  //   } else {
  //     // Show error or message indicating that two rows must be selected
  //     console.log("Please select two rows to combine.");
  //   }

  //   // this.parsedData.forEach(row => {
  //   //   console.log(row);
  //   // })
  // }

  combineRows() {
    console.log("rows to combine: ", this.selectedRows);
    console.log("select length: ", this.selectedRows.length);
    if (this.selectedRows.length >= 2) {
      console.log("before combining rows: ", this.parsedData);
        // Calculate net sum for all selected rows
        const netSum = this.selectedRows.reduce((acc, row) => acc + (parseFloat(row['net']) || 0), 0);
        console.log("net sum: ", netSum);
        
        // Create combined row based on the first selected row
        const combinedRow = { ...this.selectedRows[0] };
        combinedRow['net'] = netSum; // Set net field to the net sum
        
        // Push the combined row to the parsedData array
        this.parsedData.push(combinedRow);
        console.log("paresed Data after pushing new row: ", this.parsedData);

        // Remove selected rows from the parsedData array
        this.parsedData = this.parsedData.filter(row => !this.selectedRows.includes(row));

        console.log("parsedData in combine:", this.parsedData);
        
        // Clear selected rows
        this.selectedRows = [];
    } else {
        // Show error or message indicating that at least two rows must be selected
        console.log("Please select at least two rows to combine.");
    }
}

  autoCombineRows() {

    while(this.duplicates(this.parsedData)){
      // let temp = this.parsedData;
      // let i = 0;
      // this.selectedRows.push(temp[i]);

      // for(let j = i+1; j < temp.length; j++){
      //   console.log("parse i: ", i, " ", temp[i].player_id, " parse j: ", j, " ", temp[j].player_id);
      //   if(temp[i].player_id === temp[j].player_id) {
      //     console.log("made it here");
      //     this.selectedRows.push(temp[j]);
      //     // this.selectedRows.forEach(row => {
      //     //   console.log("rows in selectedRows: ", row);
      //     // })
      //   }
      // }
      this.combineRows();

    // // let temp = 
    // for(let i = 0; i < this.parsedData.length-1; i++) {
    //   for(let j = i+1; j < this.parsedData.length; j++) {
    //     console.log("parse i: ", i, " ", this.parsedData[i].player_id, " parse j: ", j, " ", this.parsedData[j].player_id);
    //     if(this.parsedData[i].player_id === this.parsedData[j].player_id) {
    //       console.log("made it here");
    //       if(!this.selectedRows.includes(this.parsedData[i])) {
    //         this.selectedRows.push(this.parsedData[i]);
    //       }
    //       this.selectedRows.push(this.parsedData[j]);
    //       // this.selectedRows.forEach(row => {
    //       //   console.log("rows in selectedRows: ", row);
    //       // })
    //     }
    //   }
      // this.combineRows();
    }
  }

  duplicates(arr: any[]) {
    for(let i = 0; i < arr.length-1; i++) {
      for(let j = i+1; j < arr.length; j++) {
        if(arr[i].player_id === arr[j].player_id){
          if(!this.selectedRows.includes(this.parsedData[i])) {
            this.selectedRows.push(this.parsedData[i]);
          }
          this.selectedRows.push(arr[j]);
        }
      }
      if(this.selectedRows.length != 0) {
        return true;
      }
    }
    return false;
  }


}
