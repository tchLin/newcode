package main
import "sort"
import "strings"
func aaMax(a,b int)int{if a>b{return a};return b}
func aaMin(a,b int)int{if a<b{return a};return b}
func maxSubArray(a []int)int{end,best:=a[0],a[0];for _,x:=range a[1:]{end=aaMax(x,end+x);best=aaMax(best,end)};return best}
func search(a []int,t int)int{l,r:=0,len(a)-1;for l<=r{m:=(l+r)/2;if a[m]==t{return m};if a[l]<=a[m]{if a[l]<=t&&t<a[m]{r=m-1}else{l=m+1}}else{if a[m]<t&&t<=a[r]{l=m+1}else{r=m-1}}};return -1}
func missingNumber(a []int)int{x:=len(a);for i,v:=range a{x^=i^v};return x}
func getSum(a,b int)int{x,y:=uint32(a),uint32(b);for y!=0{carry:=(x&y)<<1;x^=y;y=carry};return int(int32(x))}
func reverseBits(n uint32)uint32{var out uint32;for i:=0;i<32;i++{out=(out<<1)|(n&1);n>>=1};return out}
func longestCommonSubsequence(a,b string)int{d:=make([][]int,len(a)+1);for i:=range d{d[i]=make([]int,len(b)+1)};for i:=1;i<=len(a);i++{for j:=1;j<=len(b);j++{if a[i-1]==b[j-1]{d[i][j]=d[i-1][j-1]+1}else{d[i][j]=aaMax(d[i-1][j],d[i][j-1])}}};return d[len(a)][len(b)]}
func combinationSum4(a []int,t int)int{d:=make([]int,t+1);d[0]=1;for i:=1;i<=t;i++{for _,v:=range a{if v<=i{d[i]+=d[i-v]}}};return d[t]}
func linear(a []int)int{x,y:=0,0;for _,v:=range a{x,y=y,aaMax(y,x+v)};return y}
func rob(a []int)int{if len(a)==1{return a[0]};return aaMax(linear(a[1:]),linear(a[:len(a)-1]))}
func numDecodings(s string)int{d:=make([]int,len(s)+1);d[0]=1;for i:=1;i<=len(s);i++{if s[i-1]!='0'{d[i]+=d[i-1]};if i>1{v:=int(s[i-2]-'0')*10+int(s[i-1]-'0');if v>=10&&v<=26{d[i]+=d[i-2]}}};return d[len(s)]}
func uniquePaths(m,n int)int{d:=make([]int,n);for i:=range d{d[i]=1};for y:=1;y<m;y++{for x:=1;x<n;x++{d[x]+=d[x-1]}};return d[n-1]}
func longestConsecutive(a []int)int{set:=map[int]bool{};for _,x:=range a{set[x]=true};best:=0;for x:=range set{if !set[x-1]{y:=x;for set[y]{y++};best=aaMax(best,y-x)}};return best}
func root(p []int,x int)int{for p[x]!=x{p[x]=p[p[x]];x=p[x]};return x}
func countComponents(n int,e [][]int)int{p:=make([]int,n);for i:=range p{p[i]=i};count:=n;for _,v:=range e{a,b:=root(p,v[0]),root(p,v[1]);if a!=b{p[a]=b;count--}};return count}
func validTree(n int,e [][]int)bool{return len(e)==n-1&&countComponents(n,e)==1}
func canAttendMeetings(a [][]int)bool{sort.Slice(a,func(i,j int)bool{return a[i][0]<a[j][0]});for i:=1;i<len(a);i++{if a[i][0]<a[i-1][1]{return false}};return true}
func minMeetingRooms(a [][]int)int{events:=[][2]int{};for _,p:=range a{events=append(events,[2]int{p[0],1},[2]int{p[1],-1})};sort.Slice(events,func(i,j int)bool{if events[i][0]==events[j][0]{return events[i][1]<events[j][1]};return events[i][0]<events[j][0]});count,best:=0,0;for _,e:=range events{count+=e[1];best=aaMax(best,count)};return best}
func isPalindrome(s string)bool{a:=[]byte{};for _,c:=range []byte(strings.ToLower(s)){if c>='a'&&c<='z'||c>='0'&&c<='9'{a=append(a,c)}};for l,r:=0,len(a)-1;l<r;l,r=l+1,r-1{if a[l]!=a[r]{return false}};return true}
func longestPalindrome(s string)string{start,length:=0,0;for c:=0;c<2*len(s)-1;c++{l,r:=c/2,(c+1)/2;for l>=0&&r<len(s)&&s[l]==s[r]{if r-l+1>length{start,length=l,r-l+1};l--;r++}};return s[start:start+length]}
func countSubstrings(s string)int{count:=0;for c:=0;c<2*len(s)-1;c++{l,r:=c/2,(c+1)/2;for l>=0&&r<len(s)&&s[l]==s[r]{count++;l--;r++}};return count}
func characterReplacement(s string,k int)int{count:=[26]int{};l,best:=0,0;for r:=0;r<len(s);r++{count[s[r]-'A']++;for{max:=0;for _,v:=range count{max=aaMax(max,v)};if r-l+1-max<=k{break};count[s[l]-'A']--;l++};best=aaMax(best,r-l+1)};return best}
func wordBreak(s string,words []string)bool{d:=make([]bool,len(s)+1);d[0]=true;for i:=1;i<=len(s);i++{for _,w:=range words{if i>=len(w)&&d[i-len(w)]&&s[i-len(w):i]==w{d[i]=true}}};return d[len(s)]}
func productExceptSelf(a []int)[]int{out:=make([]int,len(a));p:=1;for i,v:=range a{out[i]=p;p*=v};p=1;for i:=len(a)-1;i>=0;i--{out[i]*=p;p*=a[i]};return out}
func countBits(n int)[]int{d:=make([]int,n+1);for i:=1;i<=n;i++{d[i]=d[i>>1]+(i&1)};return d}
func spiralOrder(a [][]int)[]int{out:=[]int{};t,b,l,r:=0,len(a)-1,0,len(a[0])-1;for t<=b&&l<=r{for x:=l;x<=r;x++{out=append(out,a[t][x])};t++;for y:=t;y<=b;y++{out=append(out,a[y][r])};r--;if t<=b{for x:=r;x>=l;x--{out=append(out,a[b][x])};b--};if l<=r{for y:=b;y>=t;y--{out=append(out,a[y][l])};l++}};return out}
func topKFrequent(a []int,k int)[]int{f:=map[int]int{};for _,x:=range a{f[x]++};v:=[]int{};for x:=range f{v=append(v,x)};sort.Slice(v,func(i,j int)bool{return f[v[i]]>f[v[j]]});return v[:k]}
func merge(a [][]int)[][]int{sort.Slice(a,func(i,j int)bool{return a[i][0]<a[j][0]});out:=[][]int{};for _,p:=range a{if len(out)>0&&p[0]<=out[len(out)-1][1]{out[len(out)-1][1]=aaMax(out[len(out)-1][1],p[1])}else{out=append(out,[]int{p[0],p[1]})}};return out}
func insert(a [][]int,b []int)[][]int{return merge(append(a,b))}
func setZeroes(a [][]int){rows,cols:=make([]bool,len(a)),make([]bool,len(a[0]));for y,row:=range a{for x,v:=range row{if v==0{rows[y]=true;cols[x]=true}}};for y:=range a{for x:=range a[y]{if rows[y]||cols[x]{a[y][x]=0}}}}
func rotate(a [][]int){for y:=range a{for x:=y+1;x<len(a);x++{a[y][x],a[x][y]=a[x][y],a[y][x]}};for _,row:=range a{for l,r:=0,len(row)-1;l<r;l,r=l+1,r-1{row[l],row[r]=row[r],row[l]}}}
func threeSum(a []int)[][]int{sort.Ints(a);var out [][]int;for i:=0;i+2<len(a);i++{if i>0&&a[i]==a[i-1]{continue};l,r:=i+1,len(a)-1;for l<r{sum:=a[i]+a[l]+a[r];if sum<0{l++}else if sum>0{r--}else{out=append(out,[]int{a[i],a[l],a[r]});lv,rv:=a[l],a[r];for l<r&&a[l]==lv{l++};for l<r&&a[r]==rv{r--}}}};return out}
func ocean(a [][]int,atl bool)[]bool{rows,cols:=len(a),len(a[0]);seen:=make([]bool,rows*cols);q:=[]int{};for y:=0;y<rows;y++{for x:=0;x<cols;x++{if !atl&&(y==0||x==0)||atl&&(y==rows-1||x==cols-1){seen[y*cols+x]=true;q=append(q,y*cols+x)}}};dirs:=[][2]int{{-1,0},{1,0},{0,-1},{0,1}};for i:=0;i<len(q);i++{y,x:=q[i]/cols,q[i]%cols;for _,d:=range dirs{ny,nx:=y+d[0],x+d[1];if ny>=0&&nx>=0&&ny<rows&&nx<cols&&!seen[ny*cols+nx]&&a[ny][nx]>=a[y][x]{seen[ny*cols+nx]=true;q=append(q,ny*cols+nx)}}};return seen}
func pacificAtlantic(a [][]int)[][]int{p,t:=ocean(a,false),ocean(a,true);out:=[][]int{};for y:=range a{for x:=range a[y]{i:=y*len(a[0])+x;if p[i]&&t[i]{out=append(out,[]int{y,x})}}};return out}
