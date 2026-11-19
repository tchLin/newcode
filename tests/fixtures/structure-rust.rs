use std::rc::Rc;
use std::cell::RefCell;
use std::collections::{HashMap,HashSet,BTreeMap,BTreeSet};
fn ref_nodes(mut p:ListLink)->Vec<Rc<RefCell<ListNode>>>{let mut a=vec![];while let Some(n)=p{p=n.borrow().next.clone();a.push(n);}a}
fn ref_link(a:Vec<Rc<RefCell<ListNode>>>)->ListLink{for i in 0..a.len(){a[i].borrow_mut().next=a.get(i+1).cloned();}a.first().cloned()}
fn ref_tree(v:i32,left:TreeLink,right:TreeLink)->TreeLink{Some(Rc::new(RefCell::new(TreeNode{val:v,left,right})))}
struct Solution;
impl Solution{
pub fn clone_graph(node:GraphLink)->GraphLink{fn f(n:GraphLink,m:&mut HashMap<usize,Rc<RefCell<Node>>>)->GraphLink{let n=n?;let key=Rc::as_ptr(&n) as usize;if let Some(c)=m.get(&key){return Some(c.clone());}let c=Rc::new(RefCell::new(Node::new(n.borrow().val)));m.insert(key,c.clone());c.borrow_mut().neighbors=n.borrow().neighbors.iter().map(|v|f(v.clone(),m)).collect();Some(c)}f(node,&mut HashMap::new())}
pub fn alien_order(words:Vec<String>)->String{let mut adj:BTreeMap<u8,BTreeSet<u8>>=BTreeMap::new();let mut deg:BTreeMap<u8,i32>=BTreeMap::new();for s in &words{for c in s.bytes(){adj.entry(c).or_default();deg.insert(c,0);}}for pair in words.windows(2){let(a,b)=(pair[0].as_bytes(),pair[1].as_bytes());let mut j=0;while j<a.len().min(b.len())&&a[j]==b[j]{j+=1;}if j==b.len()&&a.len()>b.len(){return String::new();}if j<a.len().min(b.len())&&adj.get_mut(&a[j]).unwrap().insert(b[j]){*deg.get_mut(&b[j]).unwrap()+=1;}}let mut q:Vec<u8>=deg.iter().filter(|(_,d)|**d==0).map(|(&c,_)|c).collect();let mut i=0;while i<q.len(){for v in &adj[&q[i]]{let d=deg.get_mut(v).unwrap();*d-=1;if *d==0{q.push(*v);}}i+=1;}if q.len()==deg.len(){String::from_utf8(q).unwrap()}else{String::new()}}
pub fn reverse_list(head:ListLink)->ListLink{let mut a=ref_nodes(head);a.reverse();ref_link(a)}
pub fn has_cycle(mut head:ListLink)->bool{let mut seen=HashSet::new();while let Some(n)=head{if !seen.insert(Rc::as_ptr(&n) as usize){return true;}head=n.borrow().next.clone();}false}
pub fn merge_two_lists(list1:ListLink,list2:ListLink)->ListLink{let mut a=ref_nodes(list1);a.extend(ref_nodes(list2));a.sort_by_key(|n|n.borrow().val);ref_link(a)}
pub fn merge_k_lists(lists:Vec<ListLink>)->ListLink{let mut a:Vec<_>=lists.into_iter().flat_map(ref_nodes).collect();a.sort_by_key(|n|n.borrow().val);ref_link(a)}
pub fn remove_nth_from_end(head:ListLink,n:i32)->ListLink{let mut a=ref_nodes(head);a.remove(a.len()-n as usize);ref_link(a)}
pub fn reorder_list(head:ListLink){let a=ref_nodes(head);let mut out=vec![];let(mut l,mut r)=(0,a.len());while l<r{out.push(a[l].clone());l+=1;if l<r{r-=1;out.push(a[r].clone());}}ref_link(out);}
pub fn group_anagrams(strs:Vec<String>)->Vec<Vec<String>>{let mut m:BTreeMap<Vec<u8>,Vec<String>>=BTreeMap::new();for s in strs{let mut k=s.as_bytes().to_vec();k.sort();m.entry(k).or_default().push(s);}m.into_values().collect()}
pub fn max_depth(root:TreeLink)->i32{match root{None=>0,Some(n)=>{let b=n.borrow();1+Self::max_depth(b.left.clone()).max(Self::max_depth(b.right.clone()))}}}
pub fn is_same_tree(p:TreeLink,q:TreeLink)->bool{match(p,q){(None,None)=>true,(Some(p),Some(q))=>{let(a,b)=(p.borrow(),q.borrow());a.val==b.val&&Self::is_same_tree(a.left.clone(),b.left.clone())&&Self::is_same_tree(a.right.clone(),b.right.clone())},_=>false}}
pub fn invert_tree(root:TreeLink)->TreeLink{if let Some(n)=&root{let (l,r)={let b=n.borrow();(b.left.clone(),b.right.clone())};let l=Self::invert_tree(l);let r=Self::invert_tree(r);n.borrow_mut().left=r;n.borrow_mut().right=l;}root}
pub fn max_path_sum(root:TreeLink)->i32{fn gain(t:&TreeLink,best:&mut i32)->i32{if let Some(n)=t{let b=n.borrow();let a=gain(&b.left,best).max(0);let c=gain(&b.right,best).max(0);*best=(*best).max(b.val+a+c);b.val+a.max(c)}else{0}}let mut best=i32::MIN;gain(&root,&mut best);best}
pub fn level_order(root:TreeLink)->Vec<Vec<i32>>{fn f(t:&TreeLink,d:usize,a:&mut Vec<Vec<i32>>){if let Some(n)=t{let b=n.borrow();if a.len()==d{a.push(vec![]);}a[d].push(b.val);f(&b.left,d+1,a);f(&b.right,d+1,a);}}let mut a=vec![];f(&root,0,&mut a);a}
pub fn is_subtree(root:TreeLink,sub_root:TreeLink)->bool{if let Some(n)=&root{let b=n.borrow();Self::is_same_tree(root.clone(),sub_root.clone())||Self::is_subtree(b.left.clone(),sub_root.clone())||Self::is_subtree(b.right.clone(),sub_root)}else{false}}
pub fn build_tree(preorder:Vec<i32>,inorder:Vec<i32>)->TreeLink{fn f(p:&[i32],a:&[i32])->TreeLink{if p.is_empty(){return None;}let j=a.iter().position(|&v|v==p[0]).unwrap();ref_tree(p[0],f(&p[1..j+1],&a[..j]),f(&p[j+1..],&a[j+1..]))}f(&preorder,&inorder)}
pub fn is_valid_bst(root:TreeLink)->bool{fn f(n:&TreeLink,l:i64,r:i64)->bool{match n{None=>true,Some(n)=>{let b=n.borrow();l<(b.val as i64)&&(b.val as i64)<r&&f(&b.left,l,b.val as i64)&&f(&b.right,b.val as i64,r)}}}f(&root,i64::MIN,i64::MAX)}
pub fn kth_smallest(root:TreeLink,k:i32)->i32{fn f(n:&TreeLink,a:&mut Vec<i32>){if let Some(n)=n{let b=n.borrow();f(&b.left,a);a.push(b.val);f(&b.right,a);}}let mut a=vec![];f(&root,&mut a);a[k as usize-1]}
pub fn lowest_common_ancestor(mut root:TreeLink,p:TreeLink,q:TreeLink)->TreeLink{let a=p.unwrap().borrow().val;let b=q.unwrap().borrow().val;while let Some(n)=root.clone(){let t=n.borrow();if a.max(b)<t.val{root=t.left.clone();}else if a.min(b)>t.val{root=t.right.clone();}else{return root;}}None}
pub fn find_words(mut board:Vec<Vec<char>>,words:Vec<String>)->Vec<String>{fn f(b:&mut Vec<Vec<char>>,w:&[char],r:i32,c:i32,i:usize)->bool{if i==w.len(){return true;}if r<0||c<0||r as usize>=b.len()||c as usize>=b[0].len()||b[r as usize][c as usize]!=w[i]{return false;}let ch=b[r as usize][c as usize];b[r as usize][c as usize]='\0';let found=f(b,w,r+1,c,i+1)||f(b,w,r-1,c,i+1)||f(b,w,r,c+1,i+1)||f(b,w,r,c-1,i+1);b[r as usize][c as usize]=ch;found}let mut out=vec![];for w in words{let chars:Vec<_>=w.chars().collect();let mut found=false;for r in 0..board.len(){for c in 0..board[0].len(){found=found||f(&mut board,&chars,r as i32,c as i32,0);}}if found&&!out.contains(&w){out.push(w);}}out}
}
struct StringCodec;
impl StringCodec{fn new()->Self{Self}fn encode(&mut self,strs:Vec<String>)->String{strs.into_iter().map(|s|format!("{}#{}",s.len(),s)).collect()}fn decode(&mut self,data:String)->Vec<String>{let mut a=vec![];let mut i=0;while i<data.len(){let j=i+data[i..].find('#').unwrap();let n:usize=data[i..j].parse().unwrap();a.push(data[j+1..j+1+n].to_string());i=j+1+n;}a}}
struct TreeCodec;
impl TreeCodec{fn new()->Self{Self}fn serialize(&mut self,root:TreeLink)->String{fn f(n:&TreeLink)->String{match n{None=>"#,".into(),Some(n)=>{let b=n.borrow();format!("{},{tree_left}{tree_right}",b.val,tree_left=f(&b.left),tree_right=f(&b.right))}}}f(&root)}fn deserialize(&mut self,data:String)->TreeLink{fn f(a:&[&str],i:&mut usize)->TreeLink{let s=a[*i];*i+=1;if s=="#"{None}else{let v=s.parse().unwrap();let l=f(a,i);let r=f(a,i);ref_tree(v,l,r)}}f(&data.split(',').collect::<Vec<_>>(),&mut 0)}}
struct Trie{words:HashSet<String>}
impl Trie{fn new()->Self{Self{words:HashSet::new()}}fn insert(&mut self,word:String){self.words.insert(word);}fn search(&mut self,word:String)->bool{self.words.contains(&word)}fn starts_with(&mut self,prefix:String)->bool{self.words.iter().any(|s|s.starts_with(&prefix))}}
struct WordDictionary{words:HashSet<String>}
impl WordDictionary{fn new()->Self{Self{words:HashSet::new()}}fn add_word(&mut self,word:String){self.words.insert(word);}fn search(&mut self,p:String)->bool{self.words.iter().any(|s|s.len()==p.len()&&p.bytes().zip(s.bytes()).all(|(a,b)|a==b||a==b'.'))}}
struct MedianFinder{a:Vec<i32>}
impl MedianFinder{fn new()->Self{Self{a:vec![]}}fn add_num(&mut self,num:i32){self.a.push(num);}fn find_median(&mut self)->f64{self.a.sort();let m=self.a.len()/2;if self.a.len()%2==1{self.a[m] as f64}else{(self.a[m-1] as f64+self.a[m] as f64)/2.0}}}
