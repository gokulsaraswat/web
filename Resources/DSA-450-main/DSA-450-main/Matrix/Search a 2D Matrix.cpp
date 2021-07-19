//Question : https://leetcode.com/problems/search-a-2d-matrix/

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int r=matrix.size();     //3
        int c=matrix[0].size();
        
        if (matrix.size() == 0 || matrix[0].size() == 0) 
            return false;
   
    int start=0;
    int end=(r*c)-1;
    while(start<=end){
           int mid=(start+end)/2;         //o(log(m*n))

    if(matrix[mid/r][mid%c]==target){
        return true;
        
    }else if(matrix[mid/r][mid%c]<target){
        start=mid +1;

    }else {
        end=mid-1;

    }

}
        return false;    
       
    }
    
};


------------------------------------------------------------------------------------------------------------------
    //self created solution 
    class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int r=matrix.size();
        int c=matrix[0].size();
        
        while(r>0){
            for(int i=0; i<c; i++){
            if(matrix[r-1][i]==target)
               return true;
          
        }
             
                r--;
    }
            
        return false;
        
        
        
    }
        

    
};
