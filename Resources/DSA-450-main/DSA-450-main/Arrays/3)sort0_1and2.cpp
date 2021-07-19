//#Method 1 (Sorting)
void sw(int arr[], int n){
        sort(arr.begin(), arr.end())                            Time Complexity: o(nlogn)
              for(int i=0; i<n; i++)                                            
                      cout<<arr[i]
     }
        


void sw(int arr[], int n){
        int mid=0, low=0;
        int high=n-1;

        while(mid<=high){                                       Time Complexity: O(n)
            if(arr[mid]==0){
                swap(arr[low], arr[mid]);
                low++;
                mid++;
            }
            else if(arr[mid]==1){
                mid++;
            }
            else if(arr[mid]==2){
                swap(arr[mid], arr[high]);
                high--;
            }
        }

}
