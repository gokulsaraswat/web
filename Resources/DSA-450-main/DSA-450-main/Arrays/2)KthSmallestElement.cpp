#Method1 (sorting)
sort and return n-kth element(for smallest element)           Time complexity: O(nlogn)
  and k-1th element for kth largest element         

#Method 2 (max heap)
int kthSmallest(int arr[], int l, int r, int k) {
         priority_queue<int>maxh;                              Time complexity: O(n+klogn)
        
        
        for(int i=l; i<=r; i++){
            maxh.push(arr[i]);
                if(maxh.size()>k){
                    maxh.pop();
                }
            }
            
     
            return maxh.top();
    }
