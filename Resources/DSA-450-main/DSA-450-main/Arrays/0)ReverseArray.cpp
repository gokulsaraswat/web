#Methode 1
int reverse(int arr[], int n){
    int start=0, end=n-1;
    while(start<end){                    
        int temp= arr[start];               // time complexicity is o (n) 
        arr[start]=arr[end];
        arr[end]=temp;
        start++;
        end--;
    }
    return arr;
    
}                                         



#Methode 2
void reverse(int arr[], int n){
    for(int i=0; i=n/2; i++){
        swap(arr[i], arr[n-1-i]);                        // time complexicity is o (n) 
    }
    
}
