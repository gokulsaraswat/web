//gfg one 

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m=matrix.size();
        int n=matrix[0].size();
        
        int i=0; 
        int j=m-1;
        while(i<n && j>=0){
            if(matrix[i][j]==target){
                return true;
            }
            if(matrix[i][j]>target){
                j--;        //left
            }else
                i++;         //inc row number  
        }
        return false;
        
    }
};
