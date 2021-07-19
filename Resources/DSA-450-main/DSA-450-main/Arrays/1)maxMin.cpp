void maxmin(int arr[], int n){

    if(n==1){
        cout<<"min number is "<<arr[0];
        cout<<"max number is "<<arr[0];
    }      
    
                                        //In order to minimize the number of comparisions we are increasing the no. of cases
    int max=INT_MIN;
    int min=INT_MAX;

    for(int i=0; i<n; i++){
        if(arr[i]<min){                                     //no f comp can be more reduced 
            min=arr[i];                                     // min no of comparision is 2*n 
        }
        if(arr[i]>max){
            max=arr[i];
        }
    }

    cout<<"max element is "<<max<<"\n";
    cout<<"min element is "<<min;


    


}
