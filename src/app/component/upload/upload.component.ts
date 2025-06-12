import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Analyze Receipt</h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload your receipt to get instant analysis and corrections.</p>
            </div>
            
            <!-- File Upload Section -->
            <div class="mt-5">
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                   [class.border-blue-500]="isDragging"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)" accept=".pdf,.jpg,.jpeg,.png">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <!-- Selected File Info -->
              <div *ngIf="selectedFile" class="mt-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                      <p class="text-sm text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                    </div>
                  </div>
                  <button type="button" (click)="removeFile()" class="text-gray-400 hover:text-gray-500">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Analyze Button -->
              <div class="mt-6">
                <button type="button"
                        [disabled]="!selectedFile || isAnalyzing"
                        (click)="analyzeReceipt()"
                        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg *ngIf="isAnalyzing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isAnalyzing ? 'Analyzing...' : 'Analyze Receipt' }}
                </button>
              </div>

              <!-- Analysis Result -->
              <div *ngIf="analysisResult" class="mt-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Analysis Result</h4>
                  <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ analysisResult | json }}</pre>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage" class="mt-4">
                <div class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">Error</h3>
                      <div class="mt-2 text-sm text-red-700">
                        <p>{{ errorMessage }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UploadComponent {
  selectedFile: File | null = null;
  isDragging = false;
  isAnalyzing = false;
  analysisResult: any = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.validateFile();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.selectedFile = files[0];
      this.validateFile();
    }
  }

  validateFile() {
    if (!this.selectedFile) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(this.selectedFile.type)) {
      this.errorMessage = 'Please upload a PDF, JPG, or PNG file.';
      this.selectedFile = null;
      return;
    }

    if (this.selectedFile.size > maxSize) {
      this.errorMessage = 'File size must be less than 10MB.';
      this.selectedFile = null;
      return;
    }

    this.errorMessage = null;
  }

  removeFile() {
    this.selectedFile = null;
    this.analysisResult = null;
    this.errorMessage = null;
  }

  analyzeReceipt() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    this.analysisResult = null;
    this.errorMessage = null;

    console.log('Starting receipt analysis...');
    console.log('File:', {
      name: this.selectedFile.name,
      type: this.selectedFile.type,
      size: this.selectedFile.size
    });
    console.log('API URL:', `${environment.apiUrl}/api/document/analyze`);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Log the FormData contents in a TypeScript-safe way
    console.log('FormData file:', this.selectedFile.name);

    this.apiService.uploadAndAnalyze(this.selectedFile).subscribe({
      next: (result) => {
        console.log('Analysis result:', result);
        this.analysisResult = result;
        this.isAnalyzing = false;
      },
      error: (error) => {
        console.error('Analysis error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
          headers: error.headers,
          url: error.url
        });
        
        // More detailed error message
        if (error.status === 500) {
          this.errorMessage = 'Server error: ' + (error.error?.message || error.error?.detail || 'Unknown server error');
        } else if (error.status === 413) {
          this.errorMessage = 'File is too large. Please upload a file smaller than 10MB.';
        } else if (error.status === 415) {
          this.errorMessage = 'Unsupported file type. Please upload a PDF, JPG, or PNG file.';
        } else {
          this.errorMessage = `Error ${error.status}: ${error.error?.message || error.message || 'An error occurred while analyzing the receipt.'}`;
        }
        
        this.isAnalyzing = false;
      }
    });
  }
} 