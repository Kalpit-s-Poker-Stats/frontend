import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Papa from 'papaparse';
import { simplifyList } from '../../models/simplifyList';
import { SplitwiseService } from 'src/services/splitwise.service';
import { PlayerData } from 'src/models/PlayerData';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-session-entry-page',
  templateUrl: './session-entry-page.component.html',
  styleUrls: ['./session-entry-page.component.css']
})
export class SessionEntryPageComponent {

  url = environment.apiUrl;
  // url = 'http://127.0.0.1:8000/v1/';
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
  parsedData: PlayerData[];
  selectedRows: any[] = [];
  inputForm: FormGroup;

  inputDict = new Map<string, number>();
  csvDict = new Map<string, number>();
  diffName: string;
  diffNet: number;
  isEqual: boolean;
  positive: simplifyList[] = [];
  negative: simplifyList[] = [];



  constructor(private http: HttpClient, private fb: FormBuilder, private splitwiseService: SplitwiseService) { }

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

  //TODO: need to move logic to it's own page: validate ledger (old) logic: Priority 0
  submitForm() {

    for(let i = 0; i < this.parsedData.length; i++) {
      this.csvDict.set(this.parsedData[i].player_nickname,this.parsedData[i].net);
    }
    
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
          console.log("Adding name: ", names[i], " with net: ", Math.round(numbers[i]*100));
          this.inputDict.set(names[i], Math.round(numbers[i]*100));
        }
      }


      this.isEqual = this.compare();
      console.log("Name: ", this.diffName, " Amount: ", this.diffNet);

      this.inputDict.clear();
      this.csvDict.clear();
      this.diffName = "";
      this.diffNet = 0;

    } else {
      console.error('Form controls are null or undefined');
    }
  }

  //TODO: need to move logic to it's own page: validate ledger (old) logic: Priority 0
  compare() {

    console.log("csvSize: ", this.csvDict);
    if(this.csvDict.size !== this.inputDict.size) {
      console.log("returning bc csv dict size = ", this.csvDict.size, " and inputDict size is = ", this.inputDict.size);
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
      console.log("made it here");
      console.log("sortedCSV: ", csvArray[i][1]);
      if(csvArray[i][0].toLowerCase() != inputArray[i][0].toLowerCase()) {
        this.diffName = csvArray[i][0];
        this.diffNet = csvArray[i][1];
        return false;
      }
      if(csvArray[i][1] != inputArray[i][1]) {
        console.log("inputArray: ", inputArray[i][1]);
        this.diffName = csvArray[i][0];
        this.diffNet = csvArray[i][1];
        return false;
      }
    }

    return true;
  }


  parseLedger() {
    Papa.parse(this.selectedFile, {
      complete: (result: any) => {
        this.parsedData = result.data;
        console.log('Parsed CSV data:', this.parsedData);
        this.filters();
        this.autoCombineRows();
      },
      header: true // If the CSV has headers
    });
  }

  filters() {
    this.parsedData = this.parsedData.filter(row => row.net != 0);
    this.parsedData = this.parsedData.filter(row => row.player_nickname != "");
    this.parsedData = this.parsedData.map(item => {
      const updatedItem: PlayerData = { ...item };
      
      for (const key in updatedItem) {
        if (typeof updatedItem[key as keyof PlayerData] === 'string' && (updatedItem[key as keyof PlayerData] as string).trim().length === 0) {
          (updatedItem[key as keyof PlayerData] as string | null) = null;}

        if (key === 'net' && typeof updatedItem[key as keyof PlayerData] === 'string') {
          (updatedItem[key as keyof PlayerData] as number) = (updatedItem[key as keyof PlayerData] as number) / 100;
        }

        if(key === 'buy_in') {
          (updatedItem[key as keyof PlayerData] as number) = (updatedItem[key as keyof PlayerData] as number) / 100;
        }

        if(key === 'buy_out') {
          (updatedItem[key as keyof PlayerData] as number) = (updatedItem[key as keyof PlayerData] as number) / 100;
        }
        if(key === 'stack') {
          (updatedItem[key as keyof PlayerData] as number) = (updatedItem[key as keyof PlayerData] as number) / 100;
        }
      }

      return updatedItem;
    });

  }

  getColumnHeaders(data: PlayerData[]): (keyof PlayerData)[] {
    return Object.keys(data[0]) as (keyof PlayerData)[]
  }

  //TODO: let's keep this, but needs to be fixed: Priority 0
  getTotalNet(): number {
    let total: number = 0;
    if (this.parsedData && this.parsedData.length > 0) {
      this.parsedData.forEach(row => {
        // Assuming 'Net' is the key for the net value
        // TODO: it doesn't add up (need to figure out why; it is concatenating)
        total += row.net;
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
      const headers = this.getColumnHeaders(this.parsedData);
      const header = headers[colIndex] as keyof PlayerData;
      // this.parsedData[rowIndex][header] = value;
       // Ensure the type of value matches the type of the PlayerData property
       if (header === 'player_nickname' || header === 'player_id') {
        this.parsedData[rowIndex][header] = value;
      } else if (header === 'session_start_at' || header === 'session_end_at') {
        this.parsedData[rowIndex][header] = value ? new Date(value) : null;
      } else if (header === 'buy_in' || header === 'stack' || header === 'net') {
        this.parsedData[rowIndex][header] = parseFloat(value);
      } else {
        console.error(`Unhandled header: ${header}`);
      }
    }
  }

  onSubmit(event: Event): void {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    console.log("parsed Data: ", this.parsedData)

    event.preventDefault();

    console.log("json: ", JSON.stringify(this.parsedData));
    this.http.post(this.url + "session/submit_ledger", this.parsedData, { headers }).subscribe(
      (response) => {
        console.log("Success");
      },
      (error) => {
        console.error("Error calling backend");
      }
    )

  }

  //Used for Simplify Debts Algo
  clear() {
    this.positive = [];
    this.negative = [];
  }


  //This is used for the simplify debts algorithm
  formatDataForSimplify(arr: any) {
    for(let i = 0; i < arr.length; i++) {
      if(arr[i].net > 0) {
        this.positive.push({player_name: arr[i].player_nickname, player_id: arr[i].player_id, player_net: arr[i].net});
      } else if(arr[i].net < 0) {
        this.negative.push({player_name: arr[i].player_nickname, player_id: arr[i].player_id, player_net: arr[i].net});
      }
    }

    this.positive.sort((a, b) => b.player_net - a.player_net);
    this.negative.sort((a, b) => b.player_net - a.player_net);
  }

  //Simplify Debts Algo
  simplifyDebts() : simplifyList[] {
    const simplifiedDebts: simplifyList[] = [];
    let runningTotal: number = 0;
    for (const debtor of this.negative) {
      let remainingDebt = -1*(debtor.player_net);
      runningTotal += -1*remainingDebt;
      for (let i = 0; i < this.positive.length && remainingDebt > 0; i++) {
          const creditor = this.positive[i];
          const transferAmount = Math.min(creditor.player_net, remainingDebt);
          runningTotal += transferAmount;
          simplifiedDebts.push({
              player_name: creditor.player_name,
              player_id: debtor.player_id + "->" + creditor.player_id,
              player_net: transferAmount
          });
          console.log(debtor.player_name + " pays " + creditor.player_name + " " + transferAmount);
          remainingDebt -= transferAmount;
          creditor.player_net -= transferAmount;
          if (creditor.player_net === 0) {
              this.positive.splice(i, 1);
              i--;
          }
          
      }
  }

  console.log("runningTotal: ", runningTotal);

  return simplifiedDebts;
  }

  // TODO: may not need as there should always be one pn_id for each player
  selectRow(row: any) {
    const index = this.selectedRows.findIndex(selectedRow => selectedRow === row);
    if (index !== -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
  }


  // TODO: may not need as there should always be one pn_id for each player
  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  combineRows() {
    console.log("rows to combine: ", this.selectedRows);
    console.log("select length: ", this.selectedRows.length);
    if (this.selectedRows.length >= 2) {
      console.log("before combining rows: ", this.parsedData);
      const combinedRow = { ...this.selectedRows[0] };
      //   // Calculate net sum for all selected rows
        const netSum = this.selectedRows.reduce((acc, row) => acc + (parseFloat(row['net']) || 0), 0);
        combinedRow['net'] = netSum.toFixed(2); // Set net field to the net sum

        const buyInSum = this.selectedRows.reduce((acc, row) => acc + (parseFloat(row['buy_in']) || 0), 0);
        combinedRow['buy_in'] = buyInSum.toFixed(0); // Set buy_in field to the sum

        const buyOutSum = this.selectedRows.reduce((acc, row) => acc + (parseFloat(row['buy_out']) || 0), 0);
        combinedRow['buy_out'] = buyOutSum.toFixed(0); // Set buy_out field to the sum
        
        // Create combined row based on the first selected row
        // const combinedRow = { ...this.selectedRows[0] };
        // combinedRow['net'] = netSum.toFixed(2); // Set net field to the net sum
        
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
      this.combineRows();
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
