import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RawAnalysis } from '../../interfaces/raw-analysis.interface';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
interface RawInvoiceData {
  InvoiceDate: string
  InvoiceTotal: string
  Items: string
  PaymentTerm: string
  SubTotal: string
  VendorAddress: string
  VendorAddressRecipient: string
  VendorName: string
  VendorTaxId: string
}

interface FilteredInvoiceData {
  Date: string
  Montant_HT: string
  Montant_TTC: string
}

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  providers: [ApiService],
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent {
    selectedFile = signal<File | null>(null)
  rawData = signal<RawInvoiceData | null>(null)
  filteredData = signal<FilteredInvoiceData | null>(null)
  errorMessage = signal<string>("")
  isLoading = signal<boolean>(false)
  activeTab = signal<"raw" | "filtered">("raw")
  isDragOver = signal<boolean>(false)

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0])
      this.clearResults()
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver.set(true)
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver.set(false)
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    this.isDragOver.set(false)

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.selectedFile.set(files[0])
      this.clearResults()
    }
  }

  removeFile(): void {
    this.selectedFile.set(null)
    this.clearResults()
  }

  analyzeInvoice(): void {
    if (!this.selectedFile()) return

    this.isLoading.set(true)
    this.errorMessage.set("")

    const formData = new FormData()
    formData.append("file", this.selectedFile()!)

    // Simulate API calls with mock data
    this.simulateRawAnalysis()
      .then(() => this.simulateFilteredAnalysis())
      .catch((error) => {
        this.errorMessage.set(`Erreur d'analyse: ${error.message}`)
      })
      .finally(() => {
        this.isLoading.set(false)
      })
  }

  private async simulateRawAnalysis(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockRawData: RawInvoiceData = {
      InvoiceDate: "12 février 2023",
      InvoiceTotal: "7€00",
      Items: "Azure.AI.FormRecognizer.DocumentAnalysis.DocumentField",
      PaymentTerm: "Espèces",
      SubTotal: "6€36",
      VendorAddress: "22 place des Vosges\n75004 Paris - France",
      VendorAddressRecipient: "Café Hugo",
      VendorName: "Café Hugo\nPlace des Usages",
      VendorTaxId: "00 850 (170 648",
    }

    this.rawData.set(mockRawData)
  }

  private async simulateFilteredAnalysis(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockFilteredData: FilteredInvoiceData = {
      Date: "2023-02-12",
      Montant_HT: "6,36",
      Montant_TTC: "7,00",
    }

    this.filteredData.set(mockFilteredData)
    this.activeTab.set("filtered")
  }

  setActiveTab(tab: "raw" | "filtered"): void {
    this.activeTab.set(tab)
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  private clearResults(): void {
    this.rawData.set(null)
    this.filteredData.set(null)
    this.errorMessage.set("")
  }
}
