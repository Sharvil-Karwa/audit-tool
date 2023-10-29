
declare namespace jsPDF {
    namespace autoTable {
      interface TableModel {
        head: (string | string[])[];
        body: (string | string[])[];
        margin?: number | number[];
      }
    }
  
    interface jsPDF {
      autoTable(options: autoTable.TableModel): this;
    }
  }
  
  declare module 'jspdf-autotable' {
    export = jsPDF;
  }