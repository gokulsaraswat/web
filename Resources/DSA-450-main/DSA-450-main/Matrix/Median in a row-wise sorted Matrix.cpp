//https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1#

class Solution{   
public:
    int median(vector<vector<int>> &matrix, int r, int c){
       
        sort(matrix.begin(), matrix.end());                 //not working 
    
        int median =matrix[(r*c)/2];                      //naive 
                                                           //o(r*c*log(r*c))
        
        return median;
        
    }
};
