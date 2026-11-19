#include <vector>
#include <string>
#include <algorithm>
#include <unordered_set>
#include <unordered_map>
#include <numeric>
#include <cstdint>
#include <cctype>
using namespace std;
class Solution {
public:
int maxSubArray(vector<int>& a){int end=a[0],best=end;for(int i=1;i<a.size();i++){end=max(a[i],end+a[i]);best=max(best,end);}return best;}
int search(vector<int>& a,int t){int l=0,r=a.size()-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}return -1;}
int missingNumber(vector<int>& a){int x=a.size();for(int i=0;i<a.size();i++)x^=i^a[i];return x;}
int getSum(int a,int b){uint32_t x=static_cast<uint32_t>(a),y=static_cast<uint32_t>(b);while(y){uint32_t c=(x&y)<<1;x^=y;y=c;}return x<=INT32_MAX?static_cast<int>(x):static_cast<int>(static_cast<int64_t>(x)-4294967296LL);}
uint32_t reverseBits(uint32_t n){uint32_t out=0;for(int i=0;i<32;i++){out=(out<<1)|(n&1);n>>=1;}return out;}
int longestCommonSubsequence(string a,string b){vector<vector<int>>d(a.size()+1,vector<int>(b.size()+1));for(int i=1;i<=a.size();i++)for(int j=1;j<=b.size();j++)d[i][j]=a[i-1]==b[j-1]?d[i-1][j-1]+1:max(d[i-1][j],d[i][j-1]);return d.back().back();}
int combinationSum4(vector<int>& a,int t){vector<int>d(t+1);d[0]=1;for(int i=1;i<=t;i++)for(int v:a)if(v<=i)d[i]+=d[i-v];return d[t];}
int line(vector<int>& a,int begin,int end){int x=0,y=0;for(int i=begin;i<end;i++){int next=max(y,x+a[i]);x=y;y=next;}return y;}
int rob(vector<int>& a){return a.size()==1?a[0]:max(line(a,0,a.size()-1),line(a,1,a.size()));}
int numDecodings(string s){vector<int>d(s.size()+1);d[0]=1;for(int i=1;i<=s.size();i++){if(s[i-1]!='0')d[i]+=d[i-1];if(i>1){int v=(s[i-2]-'0')*10+s[i-1]-'0';if(v>=10&&v<=26)d[i]+=d[i-2];}}return d.back();}
int uniquePaths(int m,int n){vector<int>d(n,1);for(int y=1;y<m;y++)for(int x=1;x<n;x++)d[x]+=d[x-1];return d.back();}
int longestConsecutive(vector<int>& a){unordered_set<int>s(a.begin(),a.end());int best=0;for(int x:s)if(!s.count(x-1)){int y=x;while(s.count(y))y++;best=max(best,y-x);}return best;}
int root(vector<int>& p,int x){return p[x]==x?x:p[x]=root(p,p[x]);}
int countComponents(int n,vector<vector<int>>& edges){vector<int>p(n);iota(p.begin(),p.end(),0);int count=n;for(auto e:edges){int a=root(p,e[0]),b=root(p,e[1]);if(a!=b){p[a]=b;count--;}}return count;}
bool validTree(int n,vector<vector<int>>& e){return e.size()==n-1&&countComponents(n,e)==1;}
bool canAttendMeetings(vector<vector<int>>& a){sort(a.begin(),a.end());for(int i=1;i<a.size();i++)if(a[i][0]<a[i-1][1])return false;return true;}
int minMeetingRooms(vector<vector<int>>& a){vector<pair<int,int>>e;for(auto p:a){e.push_back({p[0],1});e.push_back({p[1],-1});}sort(e.begin(),e.end());int current=0,best=0;for(auto p:e){current+=p.second;best=max(best,current);}return best;}
bool isPalindrome(string s){int l=0,r=s.size()-1;while(l<r){while(l<r&&!isalnum((unsigned char)s[l]))l++;while(l<r&&!isalnum((unsigned char)s[r]))r--;if(tolower((unsigned char)s[l++])!=tolower((unsigned char)s[r--]))return false;}return true;}
string longestPalindrome(string s){int start=0,length=0;for(int c=0;c<2*(int)s.size()-1;c++){int l=c/2,r=(c+1)/2;while(l>=0&&r<s.size()&&s[l]==s[r]){if(r-l+1>length){start=l;length=r-l+1;}l--;r++;}}return s.substr(start,length);}
int countSubstrings(string s){int count=0;for(int c=0;c<2*(int)s.size()-1;c++){int l=c/2,r=(c+1)/2;while(l>=0&&r<s.size()&&s[l]==s[r]){count++;l--;r++;}}return count;}
int characterReplacement(string s,int k){int count[26]={},l=0,best=0;for(int r=0;r<s.size();r++){count[s[r]-'A']++;while(r-l+1-*max_element(count,count+26)>k)count[s[l++]-'A']--;best=max(best,r-l+1);}return best;}
bool wordBreak(string s,vector<string>& words){vector<bool>d(s.size()+1);d[0]=true;for(int i=1;i<=s.size();i++)for(auto w:words)if(i>=w.size()&&d[i-w.size()]&&s.compare(i-w.size(),w.size(),w)==0)d[i]=true;return d.back();}
vector<int> productExceptSelf(vector<int>& a){vector<int>out(a.size());int p=1;for(int i=0;i<a.size();i++){out[i]=p;p*=a[i];}p=1;for(int i=a.size()-1;i>=0;i--){out[i]*=p;p*=a[i];}return out;}
vector<int> countBits(int n){vector<int>d(n+1);for(int i=1;i<=n;i++)d[i]=d[i>>1]+(i&1);return d;}
vector<int> spiralOrder(vector<vector<int>>& a){vector<int>out;int t=0,b=a.size()-1,l=0,r=a[0].size()-1;while(t<=b&&l<=r){for(int x=l;x<=r;x++)out.push_back(a[t][x]);t++;for(int y=t;y<=b;y++)out.push_back(a[y][r]);r--;if(t<=b){for(int x=r;x>=l;x--)out.push_back(a[b][x]);b--;}if(l<=r){for(int y=b;y>=t;y--)out.push_back(a[y][l]);l++;}}return out;}
vector<int> topKFrequent(vector<int>& a,int k){unordered_map<int,int>f;for(int x:a)f[x]++;vector<pair<int,int>>v;for(auto [x,c]:f)v.push_back({-c,x});sort(v.begin(),v.end());vector<int>out;for(int i=0;i<k;i++)out.push_back(v[i].second);return out;}
vector<vector<int>> merge(vector<vector<int>>& a){sort(a.begin(),a.end());vector<vector<int>>out;for(auto p:a)if(!out.empty()&&p[0]<=out.back()[1])out.back()[1]=max(out.back()[1],p[1]);else out.push_back(p);return out;}
vector<vector<int>> insert(vector<vector<int>>& a,vector<int>& b){vector<vector<int>>out;int i=0;while(i<a.size()&&a[i][1]<b[0])out.push_back(a[i++]);while(i<a.size()&&a[i][0]<=b[1]){b[0]=min(b[0],a[i][0]);b[1]=max(b[1],a[i][1]);i++;}out.push_back(b);while(i<a.size())out.push_back(a[i++]);return out;}
void setZeroes(vector<vector<int>>& a){vector<bool>rows(a.size()),cols(a[0].size());for(int y=0;y<a.size();y++)for(int x=0;x<a[0].size();x++)if(a[y][x]==0){rows[y]=true;cols[x]=true;}for(int y=0;y<a.size();y++)for(int x=0;x<a[0].size();x++)if(rows[y]||cols[x])a[y][x]=0;}
void rotate(vector<vector<int>>& a){for(int y=0;y<a.size();y++)for(int x=y+1;x<a.size();x++)swap(a[y][x],a[x][y]);for(auto& row:a)reverse(row.begin(),row.end());}
vector<vector<int>> threeSum(vector<int>& a){sort(a.begin(),a.end());vector<vector<int>>out;for(int i=0;i+2<a.size();i++){if(i&&a[i]==a[i-1])continue;int l=i+1,r=a.size()-1;while(l<r){int sum=a[i]+a[l]+a[r];if(sum<0)l++;else if(sum>0)r--;else{out.push_back({a[i],a[l],a[r]});int lv=a[l],rv=a[r];while(l<r&&a[l]==lv)l++;while(l<r&&a[r]==rv)r--;}}}return out;}
vector<vector<int>> pacificAtlantic(vector<vector<int>>& a){int rows=a.size(),cols=a[0].size();auto flood=[&](bool atl){vector<bool>seen(rows*cols);vector<int>q;for(int y=0;y<rows;y++)for(int x=0;x<cols;x++)if(atl?(y==rows-1||x==cols-1):(y==0||x==0)){int i=y*cols+x;seen[i]=true;q.push_back(i);}for(int i=0;i<q.size();i++){int y=q[i]/cols,x=q[i]%cols;for(auto [dy,dx]:vector<pair<int,int>>{{-1,0},{1,0},{0,-1},{0,1}}){int ny=y+dy,nx=x+dx;if(ny>=0&&nx>=0&&ny<rows&&nx<cols&&!seen[ny*cols+nx]&&a[ny][nx]>=a[y][x]){seen[ny*cols+nx]=true;q.push_back(ny*cols+nx);}}}return seen;};auto p=flood(false),t=flood(true);vector<vector<int>>out;for(int y=0;y<rows;y++)for(int x=0;x<cols;x++)if(p[y*cols+x]&&t[y*cols+x])out.push_back({y,x});return out;}
};
