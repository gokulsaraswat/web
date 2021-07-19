void ro(int arr[], int n)
{
     int temp=arr[n-1];
   for(int i=n-1; i>=0; i--)                    Time Complexity:o(n2)
      arr[i]=arr[i-1];
      
      arr[0]=temp;

      for(int i=0; i<n; i++){
          cout<<arr[i]<<" ";
      }
    
}

------------------------------------------------------------------------------------------
     rotate array by k elements by right 
     
     
     void ro(int arr[], int n, int k)
{
    reverse(arr.begin(), arr.begin()+n-k);
     reverse (arr.begin()+n-k, arr.end());
     reverse(arr.begin(), arr.end());
    
}

//for left
 // reverse(nums.begin(), nums.begin()+k);
    // reverse(nums.begin()+k, nums.end());
    // reverse(nums.begin(), nums.end());

    // return nums;

     
