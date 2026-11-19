use std::collections::{HashSet,HashMap};
struct Solution;
impl Solution {
pub fn max_sub_array(a:Vec<i32>)->i32{let(mut end,mut best)=(a[0],a[0]);for &x in &a[1..]{end=x.max(end+x);best=best.max(end);}best}
pub fn search(a:Vec<i32>,t:i32)->i32{let(mut l,mut r)=(0i32,a.len() as i32-1);while l<=r{let m=(l+r)/2;if a[m as usize]==t{return m;}if a[l as usize]<=a[m as usize]{if a[l as usize]<=t&&t<a[m as usize]{r=m-1;}else{l=m+1;}}else if a[m as usize]<t&&t<=a[r as usize]{l=m+1;}else{r=m-1;}}-1}
pub fn missing_number(a:Vec<i32>)->i32{let mut x=a.len() as i32;for(i,v)in a.into_iter().enumerate(){x^=i as i32^v;}x}
pub fn get_sum(a:i32,b:i32)->i32{let(mut x,mut y)=(a as u32,b as u32);while y!=0{let c=(x&y)<<1;x^=y;y=c;}x as i32}
pub fn reverse_bits(mut n:u32)->u32{let mut out=0;for _ in 0..32{out=(out<<1)|(n&1);n>>=1;}out}
pub fn longest_common_subsequence(a:String,b:String)->i32{let(a,b)=(a.as_bytes(),b.as_bytes());let mut d=vec![vec![0;b.len()+1];a.len()+1];for i in 1..=a.len(){for j in 1..=b.len(){d[i][j]=if a[i-1]==b[j-1]{d[i-1][j-1]+1}else{d[i-1][j].max(d[i][j-1])};}}d[a.len()][b.len()]}
pub fn combination_sum4(a:Vec<i32>,target:i32)->i32{let t=target as usize;let mut d=vec![0;t+1];d[0]=1;for i in 1..=t{for &v in &a{if v as usize<=i{d[i]+=d[i-v as usize];}}}d[t]}
fn linear(a:&[i32])->i32{let(mut x,mut y)=(0,0);for &v in a{let next=y.max(x+v);x=y;y=next;}y}
pub fn rob(a:Vec<i32>)->i32{if a.len()==1{a[0]}else{Self::linear(&a[1..]).max(Self::linear(&a[..a.len()-1]))}}
pub fn num_decodings(s:String)->i32{let s=s.as_bytes();let mut d=vec![0;s.len()+1];d[0]=1;for i in 1..=s.len(){if s[i-1]!=b'0'{d[i]+=d[i-1];}if i>1{let v=(s[i-2]-b'0')*10+s[i-1]-b'0';if v>=10&&v<=26{d[i]+=d[i-2];}}}d[s.len()]}
pub fn unique_paths(m:i32,n:i32)->i32{let mut d=vec![1;n as usize];for _ in 1..m{for x in 1..n as usize{d[x]+=d[x-1];}}d[n as usize-1]}
pub fn longest_consecutive(a:Vec<i32>)->i32{let s:HashSet<i32>=a.into_iter().collect();let mut best=0;for &x in &s{if !s.contains(&(x-1)){let mut y=x;while s.contains(&y){y+=1;}best=best.max(y-x);}}best}
fn root(p:&mut Vec<usize>,mut x:usize)->usize{while p[x]!=x{p[x]=p[p[x]];x=p[x];}x}
pub fn count_components(n:i32,e:Vec<Vec<i32>>)->i32{let mut p:Vec<usize>=(0..n as usize).collect();let mut count=n;for v in e{let a=Self::root(&mut p,v[0] as usize);let b=Self::root(&mut p,v[1] as usize);if a!=b{p[a]=b;count-=1;}}count}
pub fn valid_tree(n:i32,e:Vec<Vec<i32>>)->bool{e.len()==(n-1)as usize&&Self::count_components(n,e)==1}
pub fn can_attend_meetings(mut a:Vec<Vec<i32>>)->bool{a.sort();(1..a.len()).all(|i|a[i][0]>=a[i-1][1])}
pub fn min_meeting_rooms(a:Vec<Vec<i32>>)->i32{let mut events=vec![];for p in a{events.push((p[0],1));events.push((p[1],-1));}events.sort();let(mut count,mut best)=(0,0);for(_,d)in events{count+=d;best=best.max(count);}best}
pub fn is_palindrome(s:String)->bool{let a:Vec<u8>=s.bytes().filter(|c|c.is_ascii_alphanumeric()).map(|c|c.to_ascii_lowercase()).collect();a.iter().eq(a.iter().rev())}
pub fn longest_palindrome(s:String)->String{let a=s.as_bytes();let(mut start,mut length)=(0usize,0usize);for c in 0..2*a.len()-1{let(mut l,mut r)=((c/2)as i32,((c+1)/2)as i32);while l>=0&&(r as usize)<a.len()&&a[l as usize]==a[r as usize]{if (r-l+1)as usize>length{start=l as usize;length=(r-l+1)as usize;}l-=1;r+=1;}}s[start..start+length].to_string()}
pub fn count_substrings(s:String)->i32{let a=s.as_bytes();let mut count=0;for c in 0..2*a.len()-1{let(mut l,mut r)=((c/2)as i32,((c+1)/2)as i32);while l>=0&&(r as usize)<a.len()&&a[l as usize]==a[r as usize]{count+=1;l-=1;r+=1;}}count}
pub fn character_replacement(s:String,k:i32)->i32{let a=s.as_bytes();let mut count=[0;26];let(mut l,mut best)=(0usize,0usize);for r in 0..a.len(){count[(a[r]-b'A')as usize]+=1;while (r-l+1)as i32-*count.iter().max().unwrap()>k{count[(a[l]-b'A')as usize]-=1;l+=1;}best=best.max(r-l+1);}best as i32}
pub fn word_break(s:String,words:Vec<String>)->bool{let mut d=vec![false;s.len()+1];d[0]=true;for i in 1..=s.len(){for w in &words{if i>=w.len()&&d[i-w.len()]&&&s[i-w.len()..i]==w{d[i]=true;}}}d[s.len()]}
pub fn product_except_self(a:Vec<i32>)->Vec<i32>{let mut out=vec![1;a.len()];let mut p=1;for i in 0..a.len(){out[i]=p;p*=a[i];}p=1;for i in (0..a.len()).rev(){out[i]*=p;p*=a[i];}out}
pub fn count_bits(n:i32)->Vec<i32>{let mut d=vec![0;n as usize+1];for i in 1..=n as usize{d[i]=d[i>>1]+(i&1)as i32;}d}
pub fn spiral_order(a:Vec<Vec<i32>>)->Vec<i32>{let mut out=vec![];let(mut t,mut b,mut l,mut r)=(0i32,a.len()as i32-1,0i32,a[0].len()as i32-1);while t<=b&&l<=r{for x in l..=r{out.push(a[t as usize][x as usize]);}t+=1;for y in t..=b{out.push(a[y as usize][r as usize]);}r-=1;if t<=b{for x in (l..=r).rev(){out.push(a[b as usize][x as usize]);}b-=1;}if l<=r{for y in (t..=b).rev(){out.push(a[y as usize][l as usize]);}l+=1;}}out}
pub fn top_k_frequent(a:Vec<i32>,k:i32)->Vec<i32>{let mut f=HashMap::new();for x in a{*f.entry(x).or_insert(0)+=1;}let mut v:Vec<(i32,i32)>=f.into_iter().map(|(x,c)|(-c,x)).collect();v.sort();v.into_iter().take(k as usize).map(|(_,x)|x).collect()}
pub fn merge(mut a:Vec<Vec<i32>>)->Vec<Vec<i32>>{a.sort();let mut out:Vec<Vec<i32>>=vec![];for p in a{if let Some(last)=out.last_mut(){if p[0]<=last[1]{last[1]=last[1].max(p[1]);continue;}}out.push(p);}out}
pub fn insert(mut a:Vec<Vec<i32>>,b:Vec<i32>)->Vec<Vec<i32>>{a.push(b);Self::merge(a)}
pub fn set_zeroes(a:&mut Vec<Vec<i32>>){let mut rows=vec![false;a.len()];let mut cols=vec![false;a[0].len()];for y in 0..a.len(){for x in 0..a[0].len(){if a[y][x]==0{rows[y]=true;cols[x]=true;}}}for y in 0..a.len(){for x in 0..a[0].len(){if rows[y]||cols[x]{a[y][x]=0;}}}}
pub fn rotate(a:&mut Vec<Vec<i32>>){for y in 0..a.len(){for x in y+1..a.len(){let v=a[y][x];a[y][x]=a[x][y];a[x][y]=v;}}for row in a{row.reverse();}}
pub fn three_sum(mut a:Vec<i32>)->Vec<Vec<i32>>{a.sort();let mut out=vec![];for i in 0..a.len()-2{if i>0&&a[i]==a[i-1]{continue;}let(mut l,mut r)=(i+1,a.len()-1);while l<r{let sum=a[i]+a[l]+a[r];if sum<0{l+=1;}else if sum>0{r-=1;}else{out.push(vec![a[i],a[l],a[r]]);let(lv,rv)=(a[l],a[r]);while l<r&&a[l]==lv{l+=1;}while l<r&&a[r]==rv{r-=1;}}}}out}
fn ocean(a:&Vec<Vec<i32>>,atl:bool)->Vec<bool>{let(rows,cols)=(a.len(),a[0].len());let mut seen=vec![false;rows*cols];let mut q=vec![];for y in 0..rows{for x in 0..cols{if if atl{y==rows-1||x==cols-1}else{y==0||x==0}{seen[y*cols+x]=true;q.push(y*cols+x);}}}let mut head=0;while head<q.len(){let(y,x)=(q[head]/cols,q[head]%cols);head+=1;for(dy,dx)in [(-1,0),(1,0),(0,-1),(0,1)]{let(ny,nx)=(y as i32+dy,x as i32+dx);if ny>=0&&nx>=0&&(ny as usize)<rows&&(nx as usize)<cols{let(ny,nx)=(ny as usize,nx as usize);if !seen[ny*cols+nx]&&a[ny][nx]>=a[y][x]{seen[ny*cols+nx]=true;q.push(ny*cols+nx);}}}}seen}
pub fn pacific_atlantic(a:Vec<Vec<i32>>)->Vec<Vec<i32>>{let p=Self::ocean(&a,false);let t=Self::ocean(&a,true);let mut out=vec![];for y in 0..a.len(){for x in 0..a[0].len(){let i=y*a[0].len()+x;if p[i]&&t[i]{out.push(vec![y as i32,x as i32]);}}}out}
}
