import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { uploadBytesResumable } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import { ProductsComponent } from '../components/products/products.component';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  URL: string = '';
  uploadPercent: any;
  autoIncrement: any;
  private file: any;
  private fileName: any;

  constructor(private storage: Storage, private http: HttpClient) { }

  onFileSelected(event: any) {
    this.http.get(environment.URL + "ropa/autoincrement").subscribe(data => {
      this.autoIncrement = data;
      this.file = event.target.files[0];
      this.fileName = `Ropa_${this.autoIncrement}`;
    });
  }

  onUpload(): Promise<string> {
    const filePath = `uploads/${this.fileName}`;
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, this.file);
  
    return new Promise((resolve, reject) => {
      task.then(async (snapshot) => {
        const downloadURL = await getDownloadURL(fileRef);
        const uploadPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        resolve(downloadURL);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}