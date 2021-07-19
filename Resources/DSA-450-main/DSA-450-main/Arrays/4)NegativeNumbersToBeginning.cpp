void rearr(int arr[], int n){
    int low=0;
    int high =n-1;

    while(high>=low){                                             // Time Complexity: o(n)
        if(arr[low]<0 && arr[high]<0){
                                                        //--
            low++;
        }
        else if(arr[low]>0 && arr[high]<0){             //+-
             swap(arr[low], arr[high]);
             low++;
             high--;

        }
        else if (arr[low]>0 && arr[high]>0){            //++
            high--;

        }else {                                         //-+
            low++;
            high--;
        }
    }
}
