import java.util.*;
class Solution {
public int maxSubArray(int[] a){int end=a[0],best=end;for(int i=1;i<a.length;i++){end=Math.max(a[i],end+a[i]);best=Math.max(best,end);}return best;}
public int search(int[] a,int t){int l=0,r=a.length-1;while(l<=r){int m=(l+r)/2;if(a[m]==t)return m;if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}return -1;}
public int missingNumber(int[] a){int x=a.length;for(int i=0;i<a.length;i++)x^=i^a[i];return x;}
public int getSum(int a,int b){while(b!=0){int carry=(a&b)<<1;a^=b;b=carry;}return a;}
public int reverseBits(int n){int out=0;for(int i=0;i<32;i++){out=(out<<1)|(n&1);n>>>=1;}return out;}
public int longestCommonSubsequence(String a,String b){int[][]d=new int[a.length()+1][b.length()+1];for(int i=1;i<=a.length();i++)for(int j=1;j<=b.length();j++)d[i][j]=a.charAt(i-1)==b.charAt(j-1)?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);return d[a.length()][b.length()];}
public int combinationSum4(int[] a,int t){int[]d=new int[t+1];d[0]=1;for(int i=1;i<=t;i++)for(int v:a)if(v<=i)d[i]+=d[i-v];return d[t];}
int linear(int[] a,int begin,int end){int x=0,y=0;for(int i=begin;i<end;i++){int next=Math.max(y,x+a[i]);x=y;y=next;}return y;}
public int rob(int[] a){return a.length==1?a[0]:Math.max(linear(a,0,a.length-1),linear(a,1,a.length));}
public int numDecodings(String s){int[]d=new int[s.length()+1];d[0]=1;for(int i=1;i<=s.length();i++){if(s.charAt(i-1)!='0')d[i]+=d[i-1];if(i>1){int v=(s.charAt(i-2)-'0')*10+s.charAt(i-1)-'0';if(v>=10&&v<=26)d[i]+=d[i-2];}}return d[s.length()];}
public int uniquePaths(int m,int n){int[]d=new int[n];Arrays.fill(d,1);for(int y=1;y<m;y++)for(int x=1;x<n;x++)d[x]+=d[x-1];return d[n-1];}
public int longestConsecutive(int[] a){Set<Integer>s=new HashSet<>();for(int x:a)s.add(x);int best=0;for(int x:s)if(!s.contains(x-1)){int y=x;while(s.contains(y))y++;best=Math.max(best,y-x);}return best;}
int root(int[]p,int x){return p[x]==x?x:(p[x]=root(p,p[x]));}
public int countComponents(int n,int[][]e){int[]p=new int[n];for(int i=0;i<n;i++)p[i]=i;int count=n;for(int[]v:e){int a=root(p,v[0]),b=root(p,v[1]);if(a!=b){p[a]=b;count--;}}return count;}
public boolean validTree(int n,int[][]e){return e.length==n-1&&countComponents(n,e)==1;}
public boolean canAttendMeetings(int[][]a){Arrays.sort(a,(x,y)->Integer.compare(x[0],y[0]));for(int i=1;i<a.length;i++)if(a[i][0]<a[i-1][1])return false;return true;}
public int minMeetingRooms(int[][]a){List<int[]>e=new ArrayList<>();for(int[]p:a){e.add(new int[]{p[0],1});e.add(new int[]{p[1],-1});}e.sort((x,y)->x[0]==y[0]?Integer.compare(x[1],y[1]):Integer.compare(x[0],y[0]));int count=0,best=0;for(int[]p:e){count+=p[1];best=Math.max(best,count);}return best;}
public boolean isPalindrome(String s){String t=s.replaceAll("[^A-Za-z0-9]", "").toLowerCase(Locale.ROOT);return t.equals(new StringBuilder(t).reverse().toString());}
public String longestPalindrome(String s){int start=0,length=0;for(int c=0;c<2*s.length()-1;c++){int l=c/2,r=(c+1)/2;while(l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r)){if(r-l+1>length){start=l;length=r-l+1;}l--;r++;}}return s.substring(start,start+length);}
public int countSubstrings(String s){int count=0;for(int c=0;c<2*s.length()-1;c++){int l=c/2,r=(c+1)/2;while(l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r)){count++;l--;r++;}}return count;}
public int characterReplacement(String s,int k){int[]count=new int[26];int l=0,best=0;for(int r=0;r<s.length();r++){count[s.charAt(r)-'A']++;while(true){int max=0;for(int v:count)max=Math.max(max,v);if(r-l+1-max<=k)break;count[s.charAt(l++)-'A']--;}best=Math.max(best,r-l+1);}return best;}
public boolean wordBreak(String s,String[]words){boolean[]d=new boolean[s.length()+1];d[0]=true;for(int i=1;i<=s.length();i++)for(String w:words)if(i>=w.length()&&d[i-w.length()]&&s.substring(i-w.length(),i).equals(w))d[i]=true;return d[s.length()];}
public int[] productExceptSelf(int[]a){int[]out=new int[a.length];int p=1;for(int i=0;i<a.length;i++){out[i]=p;p*=a[i];}p=1;for(int i=a.length-1;i>=0;i--){out[i]*=p;p*=a[i];}return out;}
public int[] countBits(int n){int[]d=new int[n+1];for(int i=1;i<=n;i++)d[i]=d[i>>1]+(i&1);return d;}
public int[] spiralOrder(int[][]a){List<Integer>out=new ArrayList<>();int t=0,b=a.length-1,l=0,r=a[0].length-1;while(t<=b&&l<=r){for(int x=l;x<=r;x++)out.add(a[t][x]);t++;for(int y=t;y<=b;y++)out.add(a[y][r]);r--;if(t<=b){for(int x=r;x>=l;x--)out.add(a[b][x]);b--;}if(l<=r){for(int y=b;y>=t;y--)out.add(a[y][l]);l++;}}return out.stream().mapToInt(Integer::intValue).toArray();}
public int[] topKFrequent(int[]a,int k){Map<Integer,Integer>f=new HashMap<>();for(int x:a)f.put(x,f.getOrDefault(x,0)+1);List<Integer>v=new ArrayList<>(f.keySet());v.sort((x,y)->Integer.compare(f.get(y),f.get(x)));return v.subList(0,k).stream().mapToInt(Integer::intValue).toArray();}
public int[][] merge(int[][]a){Arrays.sort(a,(x,y)->Integer.compare(x[0],y[0]));List<int[]>out=new ArrayList<>();for(int[]p:a)if(!out.isEmpty()&&p[0]<=out.get(out.size()-1)[1])out.get(out.size()-1)[1]=Math.max(out.get(out.size()-1)[1],p[1]);else out.add(p.clone());return out.toArray(new int[0][]);}
public int[][] insert(int[][]a,int[]b){int[][]all=Arrays.copyOf(a,a.length+1);all[a.length]=b;return merge(all);}
public void setZeroes(int[][]a){boolean[]rows=new boolean[a.length],cols=new boolean[a[0].length];for(int y=0;y<a.length;y++)for(int x=0;x<a[0].length;x++)if(a[y][x]==0){rows[y]=true;cols[x]=true;}for(int y=0;y<a.length;y++)for(int x=0;x<a[0].length;x++)if(rows[y]||cols[x])a[y][x]=0;}
public void rotate(int[][]a){for(int y=0;y<a.length;y++)for(int x=y+1;x<a.length;x++){int v=a[y][x];a[y][x]=a[x][y];a[x][y]=v;}for(int[]row:a)for(int l=0,r=row.length-1;l<r;l++,r--){int v=row[l];row[l]=row[r];row[r]=v;}}
public int[][] threeSum(int[]a){Arrays.sort(a);List<int[]>out=new ArrayList<>();for(int i=0;i+2<a.length;i++){if(i>0&&a[i]==a[i-1])continue;int l=i+1,r=a.length-1;while(l<r){int sum=a[i]+a[l]+a[r];if(sum<0)l++;else if(sum>0)r--;else{out.add(new int[]{a[i],a[l],a[r]});int lv=a[l],rv=a[r];while(l<r&&a[l]==lv)l++;while(l<r&&a[r]==rv)r--;}}}return out.toArray(new int[0][]);}
Set<Integer> flood(int[][]a,boolean atl){int rows=a.length,cols=a[0].length;Set<Integer>seen=new HashSet<>();List<Integer>q=new ArrayList<>();for(int y=0;y<rows;y++)for(int x=0;x<cols;x++)if(atl?(y==rows-1||x==cols-1):(y==0||x==0)){seen.add(y*cols+x);q.add(y*cols+x);}int[][]dirs={{-1,0},{1,0},{0,-1},{0,1}};for(int i=0;i<q.size();i++){int y=q.get(i)/cols,x=q.get(i)%cols;for(int[]d:dirs){int ny=y+d[0],nx=x+d[1];if(ny>=0&&nx>=0&&ny<rows&&nx<cols&&!seen.contains(ny*cols+nx)&&a[ny][nx]>=a[y][x]){seen.add(ny*cols+nx);q.add(ny*cols+nx);}}}return seen;}
public int[][] pacificAtlantic(int[][]a){Set<Integer>p=flood(a,false),t=flood(a,true);List<int[]>out=new ArrayList<>();for(int y=0;y<a.length;y++)for(int x=0;x<a[0].length;x++)if(p.contains(y*a[0].length+x)&&t.contains(y*a[0].length+x))out.add(new int[]{y,x});return out.toArray(new int[0][]);}
}
