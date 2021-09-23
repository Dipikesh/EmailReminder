class demo{
    public static void main(String[] args){
        int s = args.length;
        int a[] = new int[s];
        for(int i = 0 ;i<s ;i++){
            a[i] = Integer.parseInt(args[i]);
        }
        
        System.out.print("Hello world");
    }
}