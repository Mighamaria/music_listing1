import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Song {
  title: string;
  artist: string;
  views: string;
  imageUrl: string;
  audioUrl: string;
}

interface Songs {
  imageUrl: string;
}

enum SearchCategory {
  musicName,
  artistName,
  songLanguage,
  musicGenre,

}



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  songs: Song[] = [
    {
      title: 'Song 1',
      artist: 'Artist 1',
      views: '7.6',
      imageUrl: 'assets/slideshow/14.png',
      audioUrl: 'path/to/song1-audio.mp3'
    },
    {
      title: 'Song 2',
      artist: 'Artist 2',
      views: '8.6',
      imageUrl: 'assets/slideshow/13.png',
      audioUrl: 'path/to/song2-audio.mp3'
    },
    {
      title: 'Song 13',
      artist: 'Artist 3',
      views: '5.6',
      imageUrl: 'assets/slideshow/8.png',
      audioUrl: 'path/to/song1-audio.mp3'
    },
    {
      title: 'Song 4',
      artist: 'Artist 4',
      views: '6.6',
      imageUrl: 'assets/slideshow/10.png',
      audioUrl: 'path/to/song1-audio.mp3'
    },
    // Add more songs here...
  ];

  selectedCategory: SearchCategory = SearchCategory.musicName;

  showModal: boolean = false;
  selectedRating: number = 0;
  ratings: number[] = [];
  filteredSongs: any[] = [];
  selectedSong: any = null;
  showSongForm: boolean = false;
  searchText: string = '';
  searchQuery: string = '';
  showSearchModal: boolean = false;
  maxRating: number = 10;
  selectCategory: any = '';
  userId:number=0;
 


  showSuccessPopup: boolean = false;
  showFailurePopup: boolean = false;

 
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSongs();
    this.startCarousel();
  }

  

  fetchSongs() {
    if (this.searchQuery.trim() === '') {
      this.filteredSongs = [...this.songs];
    } else {
      this.searchByCategory(this.selectedCategory);
    }
  }

  showForm() {
    this.selectedSong = {};
    this.showSongForm = true;
  }

  cancelForm() {
    this.selectedSong = null;
    this.showSongForm = false;
  }

  newReleasedSongs: Songs[] = [
    {
      imageUrl: 'assets/slideshow/9.png'
    },
    {
      imageUrl: 'assets/slideshow/11.png'
    },
    {
      imageUrl: 'assets/slideshow/10.png'
    },
    {
      imageUrl: 'assets/slideshow/12.png'
    },
    {
      imageUrl: 'assets/slideshow/13.png'
    },
    {
      imageUrl: 'assets/slideshow/14.png'
    },
  ];

  newReleasedSongs1: Songs[] = [
    {
      imageUrl: 'assets/slideshow/9.png'
    },
    {
      imageUrl: 'assets/slideshow/11.png'
    },
    {
      imageUrl: 'assets/slideshow/10.png'
    },
    {
      imageUrl: 'assets/slideshow/12.png'
    },
    {
      imageUrl: 'assets/slideshow/13.png'
    },
    {
      imageUrl: 'assets/slideshow/14.png'
    },
  ];

  newReleasedSongs2: Songs[] = [
    {
      imageUrl: 'assets/slideshow/9.png'
    },
    {
      imageUrl: 'assets/slideshow/11.png'
    },
    {
      imageUrl: 'assets/slideshow/10.png'
    },
    {
      imageUrl: 'assets/slideshow/12.png'
    },
    {
      imageUrl: 'assets/slideshow/13.png'
    },
    {
      imageUrl: 'assets/slideshow/14.png'
    },
  ];
  slideIndex = 0;
  carouselInterval: any;

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  goToSlide(index: number) {
    this.slideIndex = index;
    clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  previousSlide() {
    this.slideIndex = this.slideIndex === 0 ? this.newReleasedSongs.length - 1 : this.slideIndex - 1;
    clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  nextSlide() {
    this.slideIndex = this.slideIndex === this.newReleasedSongs.length - 1 ? 0 : this.slideIndex + 1;
    clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  openSearchModal() {

    if (this.searchQuery.trim() === "") {
      // alert("Please enter the text.");
      this.showFailurePopup = true;
      this.searchQuery=" ";
      return;
    }
else{
    this.searchByCategory(SearchCategory.musicName);
    this.searchByCategory(SearchCategory.artistName);
    this.searchByCategory(SearchCategory.songLanguage);
    this.searchByCategory(SearchCategory.musicGenre);
    this.showSearchModal = true;
    this.searchQuery=" ";
   
    
  }
}

  closeSearchModal() {
    this.showSearchModal = false;
  }

  closeSongForm(): void {
    this.showSongForm = false;
  }

  saveSong() {
    console.log('Song saved:', this.selectedSong);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('http://localhost:8086/api/1.0/users/addMusic', this.selectedSong, { headers }).subscribe(
      (response) => {
        console.log('Song saved successfully:', response);
        this.selectedSong = null;
        this.showSongForm = false;
        this.fetchSongs();
      },
      (error) => {
        console.error('Error saving song:', error);
      }
    );
  }

  
    getRatingStars(maxRating: number): number[] {
      return Array(maxRating).fill(0).map((_, index) => index + 1);
    }
  
    isSelected(star: number): boolean {
      return star <= this.selectedRating;
    }
  
    selectRating(star: number): void {
      this.selectedRating = star;
    }
  
    addRatingToMusic(musicId: number, userId: number, overallRate: number): void {
      const url = 'http://localhost:8086/api/1.0/users/add/rating/music/${musicId}/${userId}'; // Replace with your actual API endpoint
    
      const data = {
        musicId: musicId,
        userId: userId,
        overallRate: overallRate
      };
    
      this.http.post(url, data).subscribe(
        response => {
          console.log('Rating added successfully:', response);
          this.showSuccessPopup = true;
          
          // Handle any success logic here
        },
        error => {
          console.error('Error adding rating:', error);
          // Handle any error logic here
          this.showFailurePopup = true;
        }
      );
    }
    

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log(file);
  }

  openModal(song: Song) {
    this.selectedSong = song;
    this.showModal = true;
  }

  closeModal() {
    this.selectedSong = undefined;
    this.showModal = false;
  }

  // addRatingToMusic(musicId: number, userId: number, rating: number) {
  //   const ratingDto = { rating: rating };
  //   this.http.post<any>(`http://localhost:9095/api/1.0/users/add/rating/music/${musicId}/${userId}`, ratingDto).subscribe(
  //     (response) => {
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // getMusicOverallRating(musicId: number) {
  //   this.http.get<number>(`http://localhost:9095/api/1.0/users/rating/overall/${musicId}`).subscribe(
  //     (response) => {
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  


  searchByCategory(category: SearchCategory) {
    

    let url: string;
    switch (category) {
      case SearchCategory.musicName:
        url = `http://localhost:8086/api/1.0/users/search/music/name/${this.searchQuery}`;
        break;
      case SearchCategory.artistName:
        url = `http://localhost:8086/api/1.0/users/search/music/artistName/${this.searchQuery}`;
        break;
      case SearchCategory.songLanguage:
        url = `http://localhost:8086/api/1.0/users/search/music/songLanguage/${this.searchQuery}`;
        break;
      case SearchCategory.musicGenre:
        url = `http://localhost:8086/api/1.0/users/search/music/musicGenre/${this.searchQuery}`;
        break;
      default:
        console.log("Category not found");
        return;
    }

    this.http.get<Songs[]>(url).subscribe(
      (response) => {
        console.log("JKJK")
        this.filteredSongs = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }



  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
  closeFailurePopup(): void {
    this.showFailurePopup = false;
  }


 


}